from django.template import Template
from django.template.response import TemplateResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render
from django.views.generic import ListView, CreateView, UpdateView, View
from django.contrib.auth.decorators import login_required

from common.models import Campus, Settings, SmtpConfigurations
from common.adminforms import CampusForm, SettingsForm, SmtpConfigForm

from usermgmt.models import UserRole
from usermgmt.adminforms import UserRoleForm

import smtplib
from socket import gaierror

@login_required
def dashboard(request, template="admin/dashboard.html"):
    ''' admin home page '''
    data = {}
    
    return TemplateResponse(request, template, data)

@login_required
def email_settings(request, template="admin/common/email_settings.html"):
    ''' admin home page '''
    data = {}
    try:
    	smtpconfig = SmtpConfigurations.objects.all()[0]
    	form = SmtpConfigForm(instance=smtpconfig)
    	data['object'] = smtpconfig
    except:
    	smtpconfig = SmtpConfigurations()
    	form = SmtpConfigForm()

    if request.POST:
    	if smtpconfig:
    		form = SmtpConfigForm(request.POST,instance=smtpconfig)
    	else:
    		form = SmtpConfigForm(request.POST)
    	if form.is_valid():
    		smtpconfig = form.save(commit=False)
    		smtpconfig.created_by = request.user
    		smtpconfig.save()
    	else:
    		print form.errors
    data['form'] = form
    return TemplateResponse(request, template, data)

@login_required
def test_smtp_connection(request):
    data = {}
    try:
        smtp_server = request.POST['email_host']
        port = int(request.POST['email_port'])
        secure_type = request.POST['secure_type']
        username = request.POST['email_host_user']
        passwd = request.POST['email_host_password']
        
        try:
            if secure_type == 'SSL':
                smptp_connection = smtplib.SMTP_SSL(smtp_server,port)
            else:
                smptp_connection = smtplib.SMTP(smtp_server,port)
            smptp_connection.ehlo()
            if secure_type == 'TLS':
                smptp_connection.starttls()
                smptp_connection.ehlo
            smptp_connection.login(str(username), str(passwd))
            
            subject = _('SMTP Email Config')
            email_message = 'GolfConnectx' + _(' - Successful SMTP Email Configurations')
            header = 'To:' + username + '\n' + 'From: ' + username + '\n' + 'Subject: ' +subject + '\n'
            msg = header + '\n' + email_message + ' \n\n'
            smptp_connection.sendmail(username, [username,request.user.email], msg)
            smptp_connection.close()
            result_msg = _('Connected successfully!')
            status = True
            
        except (smtplib.SMTPException, gaierror), error:
            result_msg = 'Error while test connection ' +str(error)
            status = False
            
    except:
        status = False
        result_msg = 'Error while test connection ' +str(sys.exc_info())
        
    data['result_msg'] = result_msg
    data['status'] = status
    return HttpResponse(simplejson.dumps(data))

########################## User Roles Admin Views ##########################################

class UserRoleListView(ListView):
	"""
    List the User Roles in the site.
    """
	template_name = 'admin/common/user_roles_list.html'
	
	def get_queryset(self):
		return UserRole.objects.all()

user_role_list_view = UserRoleListView.as_view()

class UserRoleAddView(CreateView):
	"""
	Adds a new campus to the site.
	"""
	model = UserRole
	form_class = UserRoleForm
	template_name = 'admin/common/user_role_form.html'

	def get_success_url(self):
		return reverse('user_role_list')

	def form_valid(self, form):
		return super(UserRoleAddView, self).form_valid(form)

user_role_add_view = UserRoleAddView.as_view()

class UserRoleUpdateView(UpdateView):
	"""
	Updates the campus information on the site.
	"""
	model = UserRole
	form_class = UserRoleForm
	template_name = 'admin/common/user_role_form.html'

	def get_success_url(self):
		return reverse('bubble_categories')

user_role_update_view = UserRoleUpdateView.as_view()

class UserRoleDeleteView(View):
	"""
	Delets the selected campus
	"""
	model = UserRole

	def get_success_url(self):
		return reverse('user_role_list')

	def get(self, request, *args, **kwargs):
		try:
			role = UserRole.objects.get(id = kwargs['pk'])
			role.delete()
			return HttpResponseRedirect(self.get_success_url())
		except ObjectDoesNotExist:
			raise Http404

user_role_delete_view = UserRoleDeleteView.as_view()

##########################General Settings Admin Views##########################################

@login_required
def settings_view(request, template="admin/common/settings_form.html"):
    ''' index page methods '''
    data = {}
    try:
    	setting = Settings.objects.all()[0]
    except:
    	setting = Settings()

    if request.POST:
    	form = SettingsForm(request.POST,instance=setting)
    	if form.is_valid():
    		settingform = form.save(commit=False)
    		settingform.save()
    else:
	    form = SettingsForm(instance=setting)
    
    data['form'] = form
   
    return TemplateResponse(request, template, data)
