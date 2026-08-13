from django.shortcuts import render, get_object_or_404, redirect
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib import messages
from django.db.models import Q, Avg
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from .models import Book, Author, Category, Review, Cart, CartItem, Order, OrderItem
from .forms import ReviewForm, UserRegistrationForm, BookForm

class BookListView(ListView):
    model = Book
    template_name = 'books/book_list.html'
    context_object_name = 'books'
    paginate_by = 12
    
    def get_queryset(self):
        queryset = Book.objects.all()
        query = self.request.GET.get('q')
        category = self.request.GET.get('category')
        
        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(authors__name__icontains=query) |
                Q(description__icontains=query)
            ).distinct()
        
        if category:
            queryset = queryset.filter(category__id=category)
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class BookDetailView(DetailView):
    model = Book
    template_name = 'books/book_detail.html'
    context_object_name = 'book'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        book = self.object
        context['reviews'] = book.reviews.all()
        context['average_rating'] = book.reviews.aggregate(Avg('rating'))['rating__avg']
        if self.request.user.is_authenticated:
            context['user_review'] = book.reviews.filter(user=self.request.user).first()
            context['review_form'] = ReviewForm()

        # Narration text: prefer the full story, fall back to the description,
        # then to a short generated blurb if neither is filled in.
        if book.full_text and book.full_text.strip():
            context['narration_text'] = book.full_text
            context['narration_is_full_story'] = True
        elif book.description and book.description.strip():
            context['narration_text'] = book.description
            context['narration_is_full_story'] = False
        else:
            authors = ", ".join(a.name for a in book.authors.all())
            parts = [book.title]
            if authors:
                parts.append(f"by {authors}")
            if book.category:
                parts.append(f"a {book.category.name} book")
            if book.publisher:
                parts.append(f"published by {book.publisher}")
            if book.pages:
                parts.append(f"{book.pages} pages long")
            context['narration_text'] = ". ".join(parts) + "."
            context['narration_is_full_story'] = False

        return context

class BookCreateView(LoginRequiredMixin, CreateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'
    success_url = reverse_lazy('book_list')

class BookUpdateView(LoginRequiredMixin, UpdateView):
    model = Book
    form_class = BookForm
    template_name = 'books/book_form.html'

class BookDeleteView(LoginRequiredMixin, DeleteView):
    model = Book
    success_url = reverse_lazy('book_list')

@login_required
def add_review(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.book = book
            review.user = request.user
            review.save()
            messages.success(request, 'Review added successfully!')
            return redirect('book_detail', pk=pk)
    return redirect('book_detail', pk=pk)

@login_required
def add_to_cart(request, pk):
    book = get_object_or_404(Book, pk=pk)
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart_item, created = CartItem.objects.get_or_create(cart=cart, book=book)
    
    if not created:
        cart_item.quantity += 1
        cart_item.save()
    
    messages.success(request, f'{book.title} added to cart!')
    return redirect('book_detail', pk=pk)

@login_required
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    return render(request, 'books/cart.html', {'cart': cart})

@login_required
def update_cart_item(request, pk):
    cart_item = get_object_or_404(CartItem, pk=pk, cart__user=request.user)
    action = request.POST.get('action')
    
    if action == 'increase':
        cart_item.quantity += 1
        cart_item.save()
    elif action == 'decrease':
        if cart_item.quantity > 1:
            cart_item.quantity -= 1
            cart_item.save()
        else:
            cart_item.delete()
    elif action == 'remove':
        cart_item.delete()
    
    return redirect('view_cart')

@login_required
def checkout(request):
    cart = get_object_or_404(Cart, user=request.user)
    
    if not cart.items.exists():
        messages.warning(request, 'Your cart is empty!')
        return redirect('view_cart')
    
    if request.method == 'POST':
        shipping_address = request.POST.get('shipping_address')
        
        order = Order.objects.create(
            user=request.user,
            total_amount=cart.total_price,
            shipping_address=shipping_address
        )
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                book=item.book,
                quantity=item.quantity,
                price=item.book.price
            )
            item.book.stock_quantity -= item.quantity
            item.book.save()
        
        cart.items.all().delete()
        messages.success(request, f'Order #{order.id} placed successfully!')
        return redirect('order_detail', pk=order.id)
    
    return render(request, 'books/checkout.html', {'cart': cart})

@login_required
def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk, user=request.user)
    return render(request, 'books/order_detail.html', {'order': order})

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user)
    return render(request, 'books/order_history.html', {'orders': orders})

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Registration successful!')
            return redirect('book_list')
    else:
        form = UserRegistrationForm()
    return render(request, 'registration/register.html', {'form': form})
def user_logout(request):
    request.session.flush()
    return redirect('login')
def delete_order(request, order_id):
    Order.objects.filter(id=order_id).delete()
    return redirect('order_history')
from django.shortcuts import redirect, get_object_or_404
from .models import Order

def delete_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    if request.method == "POST":
        order.delete()
    return redirect('/orders/')  # replace with your list page URL


def orders_list_view(request):
    orders = Order.objects.all()  # get all orders
    return render(request, 'orders_list.html', {'orders': orders})