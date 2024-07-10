from django.contrib import admin
from .models import TopWord, QuizQuestion, WordOfDay, SupportForm, Subscriber

# Register your models here.

admin.site.register(WordOfDay)
admin.site.register(TopWord)
admin.site.register(QuizQuestion)
admin.site.register(SupportForm)
admin.site.register(Subscriber)