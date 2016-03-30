<?php
defined('APPLICATION_ENV') || 
	define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));
	
defined('DS')
    || define('DS', DIRECTORY_SEPARATOR);

$staticURL = 'http://dev.st.abc.vn';
$baseURL   = 'http://dev.abc.vn';

//define variable
defined('WEB_ROOT') ||
    define('WEB_ROOT', realpath(dirname(dirname(__FILE__))));
    
defined('LIBRARY_PATH')
    || define('LIBRARY_PATH', WEB_ROOT . DS . 'library' . DS);
    
defined('FRONTEND_TEMPLATE') 
    || define('FRONTEND_TEMPLATE', 'default');
    
defined('STATIC_URL') || define('STATIC_URL', $staticURL);
defined('BASE_URL') || define('BASE_URL', $baseURL);

defined('PUBLIC_PATH') || define('PUBLIC_PATH', WEB_ROOT . '/public');
defined('STATIC_PATH') || define('STATIC_PATH', WEB_ROOT . '/static');
defined('UPLOAD_PATH') || define('UPLOAD_PATH', STATIC_PATH . '/uploads');
define('FRONTEND_FONT_PATH', STATIC_PATH . '/f/' . FRONTEND_TEMPLATE . '/fonts');

defined('UPLOAD_URL') || define('UPLOAD_URL', 'uploads');
defined('CAPTCHA_PATH') || define('CAPTCHA_PATH', STATIC_PATH . '/captcha');
defined('CAPTCHA_URL') || define('CAPTCHA_URL', $staticURL . '/captcha');
defined('VENDOR_DIR') || define('VENDOR_DIR', WEB_ROOT . '/vendor');

defined('SECRET_KEY') || define('SECRET_KEY', 'Http://wWw#pr0SH!p@vnN');
defined('CONFIG_CACHE_DIR') || define('CONFIG_CACHE_DIR', WEB_ROOT . '/config/config-cache');
defined('EXCHANGE_RATE') || define('EXCHANGE_RATE', '21600');

//save to memcached in 3 days
defined('CACHE_LIFETIME') || define('CACHE_LIFETIME', 259200);
defined('SES_EXPIRED') || define('SES_EXPIRED', 7776000);
defined('CLI_DEBUG') || define('CLI_DEBUG', 0);
defined('SEARCH_PREFIX') || define('SEARCH_PREFIX', 'microlink_vn_');
