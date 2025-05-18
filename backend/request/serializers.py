from rest_framework import serializers
from cloudinary.uploader import upload


from .models import Request

class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields  = ["id", "name", "image", "imagefile", "description",]

    def create(self, validated_data):
        image_file = validated_data.get('imagefile')  # still upload image
        result = upload(image_file)
        validated_data['image'] = result.get('secure_url')

        request = Request.objects.create(**validated_data)  # create instance
        return request