from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import views, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import TopWord, QuizQuestion, WordOfDay, Subscriber
from .serializers import SupportMessageSerializer
import google.generativeai as genai
from nltk.corpus import wordnet, words
import json, random, re

genai.configure(api_key="AIzaSyBQm3-K0kwo2784kl3fA_8Xy1B2D4ogILs")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

convo = model.start_chat(history=[])

@api_view(['GET'])
def WordOfTheDay(request):
    word_of_day = get_object_or_404(WordOfDay)
    return Response({
        'word': word_of_day.word,
        'sentence': word_of_day.sentence,
        'about': word_of_day.about
    })

@api_view(['GET'])
def TopLookUps(request):
    words = TopWord.objects.all().order_by('-id').values_list('word', flat=True)
    return Response(list(words))

@api_view(['GET'])
def addTopLookUp(request, word):
    if not TopWord.objects.filter(word=word).exists():
        TopWord.objects.create(word=word)
        return Response({'message': 'Word added successfully'}, status=200)
    else:
        return Response({'message': 'Word already exists'}, status=400)


@api_view(['GET'])
def Quiz(request):
    questions = QuizQuestion.objects.all().order_by('?').values('question', 'answers', 'correct')[:5]
    return Response(list(questions))


@api_view(['GET'])
def Word(request, word):
    data = {}

    if word:
        data['word'] = word
        synsets = wordnet.synsets(word)

        if synsets:
            categorized_synsets = {
                'noun': [],
                'verb': [],
                'adjective': [],
                'adverb': []
            }

            for synset in synsets:
                antonyms_set = set()
                synonyms_set = set()
                lemmas_set = set()

                for lemma in synset.lemmas():
                    lemmas_set.add(lemma.name())

                    # Add to synonyms set only if lemma is not the same as the word
                    if lemma.name().lower() != word.lower():
                        synonyms_set.add(lemma.name())

                    for antonym in lemma.antonyms():
                        antonyms_set.add(antonym.name())

                synset_data = {
                    'name': synset.name(),
                    'definition': synset.definition(),
                    'examples': synset.examples(),
                    'lemmas': list(lemmas_set),
                    'synonyms': list(synonyms_set),
                    'antonyms': list(antonyms_set)
                }

                pos = synset.pos()
                if pos == 'n':
                    categorized_synsets['noun'].append(synset_data)
                elif pos == 'v':
                    categorized_synsets['verb'].append(synset_data)
                elif pos == 'a':
                    categorized_synsets['adjective'].append(synset_data)
                elif pos == 'r':
                    categorized_synsets['adverb'].append(synset_data)

            data['synsets'] = categorized_synsets
        else:
            data['error'] = 'No definitions found for this word.'
    else:
        data['error'] = 'No word provided.'

    return JsonResponse(data)


@api_view(['GET'])
def WordGuess(request):
     # Pick a random word from the words corpus
    word_list = words.words()
    random_word = random.choice(word_list).lower()

    # Ensure the word length is sufficient to remove some letters
    while len(random_word) < 3:
        random_word = random.choice(word_list).lower()

    # Create a pattern and check for reasonable matches
    def generate_pattern(word):
        num_letters_to_remove = random.randint(1, len(word) // 2)
        indices_to_remove = random.sample(range(len(word)), num_letters_to_remove)
        pattern = ''.join('_' if i in indices_to_remove else word[i] for i in range(len(word)))
        regex_pattern = '^' + pattern.replace('_', '.') + '$'
        return pattern, regex_pattern

    matching_words = []
    attempts = 0

    while not matching_words and attempts < 10:
        pattern, regex_pattern = generate_pattern(random_word)
        matching_words = [word for word in word_list if re.match(regex_pattern, word)]
        attempts += 1

    # If no matches found after several attempts, just return the pattern and an empty list
    if not matching_words:
        pattern, regex_pattern = generate_pattern(random_word)
        matching_words = []

    # Prepare the response data
    data = {
        'word_with_blanks': pattern,
        'matching_words': matching_words
    }

    return JsonResponse(data)



class SupportMessageView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = SupportMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Request processed successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriberView(views.APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        if email:
            Subscriber.objects.get_or_create(email=email)
            return JsonResponse({'message': 'Subscriber added successfully'})
        return JsonResponse({'message': 'Invalid email'}, status=400)

@api_view(['GET'])
def suggestion(request, word):
  convo.send_message(f'Generate a JSON response containing 5 contextual recommendations for the word "{word}".  Structure the JSON as follows: ```json\n[{{"title": "", "example words": []}}, ...]```')
  data = convo.last.text
  clean_data = data.replace("```json","").replace("```","")
  new_data = json.loads(clean_data)
  print(new_data)
  return Response(new_data, status=200)