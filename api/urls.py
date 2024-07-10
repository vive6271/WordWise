from django.urls import path
from . import views

urlpatterns = [
    path('lookup/', views.TopLookUps, name='TopLookUps'),
    path('wordofday/', views.WordOfTheDay, name='WordOfDay'),
    path('quiz/', views.Quiz, name='Quiz'),
    path('word_guess/', views.WordGuess, name='WordGuess'),
    path('support/', views.SupportMessageView.as_view(), name='Support'),
    path('subscribe/', views.SubscriberView.as_view(), name='Subscribe'),
    path('words/<str:word>', views.Word, name='Word'),
    path('suggestion/<str:word>', views.suggestion, name='Convo'),
    path('addlookup/<str:word>', views.addTopLookUp, name='AddLookup'),
]