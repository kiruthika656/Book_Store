from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Review, Book

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'authors', 'category', 'isbn', 'description', 'full_text', 'price', 
                  'stock_quantity', 'cover_image', 'publication_date', 'publisher', 
                  'pages', 'language']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 4}),
            'full_text': forms.Textarea(attrs={
                'rows': 14,
                'placeholder': 'Paste the entire story here. This is what gets read aloud by "Listen to Story".'
            }),
            'publication_date': forms.DateInput(attrs={'type': 'date'}),
        }

class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ['rating', 'comment']
        widgets = {
            'rating': forms.Select(choices=[(i, f'{i} Star{"s" if i != 1 else ""}') for i in range(1, 6)]),
            'comment': forms.Textarea(attrs={'rows': 4, 'placeholder': 'Write your review here...'}),
        }

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']