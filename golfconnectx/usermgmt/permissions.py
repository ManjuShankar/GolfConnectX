from rest_framework import permissions

class OnlyAPIPermission(permissions.BasePermission):
	def has_permission(self, request, view):
		try:
			api_key = request.query_params.get('api_key', False)
			return True
		except:
			from sys import exc_info
			print exc_info()
			return False

