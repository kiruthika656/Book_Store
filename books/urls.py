from django.urls import path

from . import views

urlpatterns = [
    path('', views.BookListView.as_view(), name='book_list'),
    path('book/<int:pk>/', views.BookDetailView.as_view(), name='book_detail'),
    path('book/new/', views.BookCreateView.as_view(), name='book_create'),
    path('book/<int:pk>/edit/', views.BookUpdateView.as_view(), name='book_update'),
    path('book/<int:pk>/delete/', views.BookDeleteView.as_view(), name='book_delete'),
    path('book/<int:pk>/review/', views.add_review, name='add_review'),
    path('book/<int:pk>/add-to-cart/', views.add_to_cart, name='add_to_cart'),
    path('cart/', views.view_cart, name='view_cart'),
    path('cart/item/<int:pk>/update/', views.update_cart_item, name='update_cart_item'),
    path('checkout/', views.checkout, name='checkout'),
    path('order/<int:pk>/', views.order_detail, name='order_detail'),
    path('orders/', views.order_history, name='order_history'),
    path('register/', views.register, name='register'),
    path('orders/delete/<int:order_id>/', views.delete_order, name='delete_order'),
    path('orders/', views.orders_list_view, name='orders_list')
    

    
    
   

]