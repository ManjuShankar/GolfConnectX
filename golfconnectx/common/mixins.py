from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import redirect

class LoginRequiredMixin(object):

	"""
	Check if a user is logged in.
	"""
	def dispatch(self, *args, **kwargs):
		user = self.request.user
		if not user.is_authenticated():
			return redirect(reverse('login'))
		return super(LoginRequiredMixin, self).dispatch(*args, **kwargs)

	@classmethod
	def as_view(cls, **initkwargs):
		view = super(LoginRequiredMixin, cls).as_view(**initkwargs)
		return login_required(view)