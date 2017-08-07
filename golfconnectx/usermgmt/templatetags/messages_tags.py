import datetime
from django import template

register = template.Library()

from usermgmt.models import Conversation

@register.simple_tag
def conversation_name(id,user):
	con = Conversation.objects.get(id = id)
	name = con.get_conversation_name(user)
	return name.title()
