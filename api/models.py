from django.db import models
from django.db import models

# Create your models here.

class TopWord(models.Model):
    word = models.CharField(max_length=255)

    def save(self, *args, **kwargs):
        # If more than 20 other words exist, delete the oldest one
        if TopWord.objects.count() >= 21:
            oldest_word = TopWord.objects.order_by('id').first()
            if oldest_word:
                oldest_word.delete()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.word

class WordOfDay(models.Model):
    word = models.CharField(max_length=255)
    sentence = models.TextField()
    about = models.TextField()

    def __str__(self):
        return self.word

    def save(self, *args, **kwargs):
        self.pk = 1
        super(WordOfDay, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class QuizQuestion(models.Model):
    question = models.TextField()
    answers = models.JSONField(default=list)
    correct = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class SupportForm(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name

class Subscriber(models.Model):
    email = models.EmailField()

    def __str__(self):
        return self.email