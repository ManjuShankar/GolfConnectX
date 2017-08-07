import threading

from django.conf import settings
from django.core.mail.backends.smtp import EmailBackend

from common.models import SmtpConfigurations

class GcSmtpEmailBackend(EmailBackend):
    
    def __init__(self, host=None, port=None, username=None, password=None,
                 use_tls=None, fail_silently=False, use_ssl=None, **kwargs):
        super(EmailBackend, self).__init__(fail_silently=fail_silently)
        
        try:
            smtp_settings_obj = SmtpConfigurations.objects.all()[:1][0]
            self.host = smtp_settings_obj.email_host
            self.port = int(smtp_settings_obj.email_port)
            self.username = smtp_settings_obj.email_host_user
            self.password = smtp_settings_obj.email_host_password
            
            secure_type = smtp_settings_obj.secure_type
            
            try:
                settings.DEFAULT_FROM_EMAIL = smtp_settings_obj.email_host_user
                settings.DEFAULT_INFO_EMAIL = smtp_settings_obj.email_host_user
            except:pass
            
            if secure_type == 'TLS':
                self.use_tls = True
                self.use_ssl = False
            elif secure_type == 'SSL':
                self.use_tls = False
                self.use_ssl = True
            else:
                self.use_tls = False
                self.use_ssl = False
                
            if self.use_ssl and self.use_tls:
                raise ValueError(
                    "EMAIL_USE_TLS/EMAIL_USE_SSL are mutually exclusive, so only set "
                    "one of those settings to True.")
            self.connection = None
            self._lock = threading.RLock()  
            self.timeout=None
            self.ssl_keyfile=None
            self.ssl_certfile=None
        except:
            pass