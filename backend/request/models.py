from django.db import models
from datetime import timedelta
from django.utils.timezone import now

class Request(models.Model):
    owner = models.ForeignKey("user.CustomUser", on_delete=models.CASCADE, related_name="requests", null=True)
    name = models.CharField(max_length=200)
    imagefile = models.ImageField(upload_to="products_images/", blank=True, null=True)  # Write images in form of file to this field
    image = models.URLField(blank=True, null=True)  # Read images in form of cloudinary URLS from this field
    description = models.CharField(max_length=250, null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    @staticmethod
    def delete_old_requests():
        threshold_date = now() - timedelta(days=30)
        old_requests = Request.objects.filter(date_created__lt=threshold_date)
        old_requests.delete()

    def __str__(self):
        return f"{self.name}"