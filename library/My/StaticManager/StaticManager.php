<?php

namespace My\StaticManager;

use My\Utilities\MobileDetect;

class StaticManager {

    private $serviceLocator;
    private $strResource = '';
    private $isMin = 0;
    private $module = '';
    private $template = 'default';
    private $isDefer = ['defer' => 'true'];
    private $isAsync = ['async' => 'true'];
    private $arrData = ['js' => [], 'css' => []];
    public $isMobile = false;
    public $isTablet = false;

    /**
     * 
     * @param String $strResource
     */
    public function __construct($strResource = '', $serviceLocator, $strTemplate = 'default', $isMin = 1) {

        if (empty($strResource) || !$serviceLocator instanceof \Zend\ServiceManager\ServiceLocatorInterface) {
            throw new \Exception('resource cannot be blank and $serviceLocator must be instance of Zend\ServiceManager\ServiceLocatorInterface');
        }

        list($strModule, $strController, $strAction) = explode(':', $strResource);

        //không minify trong backend và môi trường dev
        if ($strModule === 'admincp' || APPLICATION_ENV !== 'production') {
            $isMin = 0;
            $this->isDefer = [];
            $this->isAsync = [];
        }

        // if (!is_writable(FRONTEND_STATIC_CACHE_PATH) && $isMin === 1) {
        //     throw new \Exception('FRONTEND_STATIC_CACHE_PATH variable undefined or ' . FRONTEND_STATIC_CACHE_PATH . ' not wriable.');
        // }
        $this->template = $strTemplate;

        $this->module = $strModule;
        $this->strResource = $strResource;
        $this->serviceLocator = $serviceLocator;
        $this->isMin = 0; //$isMin === 1 ? 1 : 0;

        //detect mobile
        $instanceMobileDetect = new MobileDetect();
        $this->isMobile = $instanceMobileDetect->isMobile();
        $this->isTablet = $instanceMobileDetect->isTablet();
//         $this->isMobile = 1; 
//        $this->isTablet = 1;

        $this->getDefaultStatic()->buildDefaultCssLib()->buildDefaultJsLib()->buildExtendCssLib()->buildExtendJsLib();
    }

    private function getDefaultStatic() {

        switch ($this->template) {
            case 'default':
                $strLibCSS = STATIC_URL . '/f/' . $this->template . '/css/??fontello.css,bootstrap.min.css,font-awesome.min.css,jquery.mCustomScrollbar.css,reset.css,jquery.qtip.min.css,style.css,custom.css';
                $strLibJS = STATIC_URL . '/f/' . $this->template . '/js/library/??modernizr.js,jquery-2.1.4.min.js,bootstrap.min.js,bootbox.min.js,jquery.mCustomScrollbar.min.js,jquery.validate.min.js,jquery.qtip.min.js,theme.plugins.js,theme.core.js';
                break;
            default:
                $strLibCSS = '';
                $strLibJS = '';
                break;
        }
        switch ($this->module) {
            case 'frontend':
                $this->arrData['css']['cssLib'] = $strLibCSS;
                $this->arrData['js']['jsLib'] = $strLibJS;
                break;
            case 'admincp':
                $this->arrData['css']['cssLib'] = STATIC_URL . '/b/css/??bootstrap.min.css,bootstrap-reset.css,font-awesome.min.css,font-awesome-animation.min.css,style.css,style-responsive.css,custom.css,table-responsive.css,pnotify.custom.min.css';
                $this->arrData['js']['jsLib'] = STATIC_URL . '/b/js/library/??jquery-1.11.3.min.js,bootstrap.min.js,jquery.dcjqaccordion.2.7.js,jquery.scrollTo.min.js,jquery.nicescroll.js,respond.min.js,bootbox.min.js,moment-with-langs.min.js,pnotify.custom.min.js,common-scripts.js';
                break;
            default:
                $this->arrData['css']['cssLib'] = '';
                $this->arrData['js']['jsLib'] = '';
                break;
        }
        return $this;
    }

    /**
     * append css use concat
     */
    private function buildDefaultCssLib() {
        $arrLib = [
            'frontend' => [
                'v2' => [
                    'frontend:topic:view' => 'amazon.css',
                    'frontend:topic:offer-view' => 'amazon.css',
                    'frontend:order:cart' => 'jasny-bootstrap.min.css',
                    'frontend:order:payment-method' => 'font-awesome-animation.min.css',
                    'frontend:user:order-view' => 'jquery.qtip.min.css',
                    'frontend:search:index' => 'amazon.css',
                    'frontend:category:advisory' => 'jquery.raty.css',
                    'frontend:category:advisory-detail' => 'jquery.raty.css',
                    'frontend:category:view' => 'amazon.css',
                ]
            ],
            'admincp' => [
                'admincp:support:history-calendar' => 'fullcalendar.css',
            ],
            'yahoo' => [
                'yahoo:index:index' => 'jquery.raty.css,owl.carousel.css',
                'yahoo:product:view' => 'style.css,jquery.bxslider.css,dd.css',
                'yahoo:category:view' => 'style.css,jquery-ui.min.css',
            ]
        ];
        //detect mobile
        if ($this->isMobile || $this->isTablet) {
            $arrLib['frontend']['v2']['frontend:topic:view'] = 'jquery.qtip.min.css,amazon-mobile.css';
            $arrLib['frontend']['v2']['frontend:topic:offer-view'] = 'amazon-mobile.css';
            $arrLib['frontend']['v2']['frontend:search:index'] = 'amazon-mobile.css';
            $arrLib['frontend']['v2']['frontend:category:view'] = 'amazon-mobile.css';
        }
        $strLib = $this->module === 'frontend' ? $arrLib[$this->module][$this->template][$this->strResource] : $arrLib[$this->module][$this->strResource];

        if ($strLib) {
            $this->arrData['css']['cssLib'] .= ',' . $strLib;
        }
        return $this;
    }

    /**
     * append css without concat
     */
    private function buildExtendCssLib() {
        $arrLib = [
            'frontend' => [
                'v2' => []
            ],
            'admincp' => [
                'backend:catalog:index' => [STATIC_URL . '/b/css/jstree/style.css'],
                'backend:catalog:add'   => [STATIC_URL . '/b/css/jstree/style.css'],
                'backend:catalog:edit'  => [STATIC_URL . '/b/css/jstree/style.css'],
                'admincp:user:edit'     => [STATIC_URL . '/b/css/sumoselect.css'],
                'admincp:user:add'      => [STATIC_URL . '/b/css/sumoselect.css']
            ]
        ];
        $arrExtendLib = $this->module === 'frontend' ? $arrLib[$this->module][$this->template][$this->strResource] : $arrLib[$this->module][$this->strResource];
        $this->arrData['css']['extendCSS'] = (isset($arrExtendLib) && is_array($arrExtendLib)) ? $arrExtendLib : [];
        return $this;
    }

    /**
     * append js use concat
     */
    private function buildDefaultJsLib() {
        $arrLib = [
            'frontend' => [
                'v2' => [
                    'frontend:index:index'              => 'jquery.rwdImageMaps.min.js',
                    'frontend:topic:view'               => 'jquery.elevateZoom-3.0.8.min.js',
                    'frontend:topic:offer-view'         => 'jquery.qtip.min.js',
                    'frontend:deal:index'               => 'jquery.plugin.min.js',
                    'frontend:order:cart'               => 'jasny-bootstrap.min.js',
                    'frontend:user:order-list'          => 'jquery.qtip.min.js',
                    'frontend:user:order-view'          => 'jquery.qtip.min.js',
                    'frontend:user:add'                 => 'jquery.inputmask.bundle.min.js',
                    'frontend:user:favourite'           => 'jquery.qtip.min.js',
                    'frontend:quotation:list'           => 'jquery.qtip.min.js',
                    'frontend:catalog:view'             => 'jquery.raty.js',
                    'frontend:category:advisory'        => 'jquery.raty.js',
                    'frontend:category:advisory-detail' => 'jquery.raty.js',
                    'frontend:category:view'            => 'jquery.nicescroll.js',
                ]
            ],
            'admincp' => [
                'admincp:user:add' => 'jquery.validate.min.js,jquery.inputmask.bundle.min.js,jquery.sumoselect.min.js',
                'admincp:user:edit' => 'jquery.validate.min.js,jquery.inputmask.bundle.min.js,jquery.sumoselect.min.js',
            ],
            'yahoo' => [
                'yahoo:index:index' => 'jquery.rwdImageMaps.min.js',
                'yahoo:product:view' => 'jquery.bxslider.min.js,jquery.elevateZoom-3.0.8.min.js,jquery.dd.min.js,countdown.js',
                'yahoo:user:auction-item-view' => 'countdown.js',
                'yahoo:index:event' => 'countdown.js',
                'yahoo:category:view' => 'jquery-ui.min.js',
            ]
        ];
        //detect mobile
        if ($this->isMobile || $this->isTablet) {
            $arrLib['frontend']['v2']['frontend:topic:view'] = 'swipe.js';
            $arrLib['frontend']['v2']['frontend:topic:offer-view'] = 'jquery.qtip.min.js';
            $arrLib['frontend']['v2']['frontend:search:index'] = '';
            $arrLib['frontend']['v2']['frontend:category:view'] = '';
        }
        $strLib = $this->module === 'frontend' ? $arrLib[$this->module][$this->template][$this->strResource] : $arrLib[$this->module][$this->strResource];
        if ($strLib) {
            $this->arrData['js']['jsLib'] .= ',' . $strLib;
        }
        return $this;
    }

    /**
     * append js without concat
     */
    private function buildExtendJsLib() {
        $arrLib = [
            'frontend' => [
                'v2' => [
                    'frontend:index:index' => [STATIC_URL . '/f/v2/js/my/??index.js'],
                    'frontend:topic:view' => [STATIC_URL . '/f/v2/js/my/??topic.js,quotation.js'],
                    'frontend:topic:offer-view' => [STATIC_URL . '/f/v2/js/my/??topic.js,quotation.js'],
                    'frontend:deal:index' => [STATIC_URL . '/f/v2/js/my/??deal.js'],
                    'frontend:contact:index' => [STATIC_URL . '/f/v2/js/my/??contact.js'],
                    'frontend:order:cart' => [STATIC_URL . '/f/v2/js/my/??order.js'],
                    'frontend:order:payment-method' => [STATIC_URL . '/f/v2/js/my/??order.js'],
                    'frontend:search:index' => [STATIC_URL . '/f/v2/js/my/??search.js'],
                    'frontend:user:add' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:edit' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:change-password' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:reset-password' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:lost-password' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:favourite' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:order-list' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:user:order-view' => [STATIC_URL . '/f/v2/js/my/??user.js'],
                    'frontend:quotation:list' => [STATIC_URL . '/f/v2/js/my/??quotation.js'],
                    'frontend:quotation:world-wide-quotation' => [STATIC_URL . '/f/v2/js/my/??quotation.js'],
                    'frontend:catalog:view' => [STATIC_URL . '/f/v2/js/my/??catalog.js'],
                    'frontend:category:advisory' => [STATIC_URL . '/f/v2/js/my/??advisory.js'],
                    'frontend:category:advisory-detail' => [STATIC_URL . '/f/v2/js/my/??advisory.js'],
                    'frontend:category:view' => [STATIC_URL . '/f/v2/js/my/??category.js'],
                ]
            ],
            'admincp' => [
                'admincp:user:add' => [STATIC_URL . '/b/js/my/??user.js'],
                'admincp:user:edit' => [STATIC_URL . '/b/js/my/??user.js'],
                'admincp:user:index' => [STATIC_URL . '/b/js/my/??user.js'],
            ],
            'yahoo' => [
                'yahoo:index:index' => [STATIC_URL . '/y/yahoo/js/my/index.js'],
                'yahoo:product:view' => array(STATIC_URL . '/y/yahoo/js/my/product.js'),
                'yahoo:user:auction-item-view' => array(STATIC_URL . '/y/yahoo/js/my/??user.js'),
                'yahoo:user:favourite' => array(STATIC_URL . '/y/yahoo/js/my/??user.js'),
                'yahoo:category:view' => [STATIC_URL . '/y/yahoo/js/my/??category.js'],
                'yahoo:search:view' => [STATIC_URL . '/y/yahoo/js/my/??search.js'],
                'yahoo:user:edit' => array(STATIC_URL . '/y/yahoo/js/my/??user.js', STATIC_URL . '/y/yahoo/js/my/??getLocation.js'),
            ]
        ];
        //detect mobile
        if ($this->isMobile || $this->isTablet) {
            $arrLib['frontend']['v2']['frontend:topic:view'] = [STATIC_URL . '/f/v2/js/my/??topic-mobile.js,quotation.js'];
            $arrLib['frontend']['v2']['frontend:topic:offer-view'] = [STATIC_URL . '/f/v2/js/my/??topic-mobile.js,quotation.js'];
            $arrLib['frontend']['v2']['frontend:search:index'] = [STATIC_URL . '/f/v2/js/my/??search-mobile.js'];
            $arrLib['frontend']['v2']['frontend:category:view'] = [STATIC_URL . '/f/v2/js/my/??category-mobile.js'];
        }
        $arrExtendLib = $this->module === 'frontend' ? $arrLib[$this->module][$this->template][$this->strResource] : $arrLib[$this->module][$this->strResource];
        $this->arrData['js']['extendJS'] = (isset($arrExtendLib) && is_array($arrExtendLib)) ? $arrExtendLib : [];
        return $this;
    }

    public function render($version = '') {
        $version = $version && APPLICATION_ENV === 'production' ? $version : time();
        $renderer = $this->serviceLocator->get('Zend\View\Renderer\PhpRenderer');

        if ($this->isMin === 1) {
            $instanceJobMinify = new \My\Job\JobMinify();
        }

        //render default CSS
        $strDefaultCSS = $this->arrData['css']['cssLib'] . '?v=' . $version;

        if ($strDefaultCSS) {
            //minify default CSS
            if ($this->isMin === 1) {
                $keyCache = hash('crc32', $strDefaultCSS) . '-v' . $version;
                $filename = FRONTEND_STATIC_CACHE_PATH . '/' . $keyCache . '.css';
                if (!file_exists($filename)) {
                    $instanceJobMinify->addJob(SEARCH_PREFIX . 'minify', ['type' => 'css', 'keycache' => $keyCache, 'url' => $strDefaultCSS, 'filename' => $filename]);
                } else {
                    $strDefaultCSS = STATIC_URL . '/f/' . FRONTEND_TEMPLATE . '/staticCache/' . $keyCache . '.css';
                }
            }
            $renderer->headLink()->offsetSetStylesheet(1, $strDefaultCSS);
        }

        //render external css
        if ($this->arrData['css']['extendCSS']) {
            $tmp = 1;
            foreach ($this->arrData['css']['extendCSS'] as $k => $css) {
                $tmp +=1;
                $renderer->headLink()->offsetSetStylesheet($tmp, $css . '?v=' . $version);
            }
        }

        //render default JS
        $strDefaultJS = $this->arrData['js']['jsLib'] . '?v=' . $version;
        if ($strDefaultJS) {
            //minify default JS
            if ($this->isMin === 1) {
                $keyCache = hash('crc32', $strDefaultJS) . '-v' . $version;
                $filename = FRONTEND_STATIC_CACHE_PATH . '/' . $keyCache . '.js';
                if (!file_exists($filename)) {
                    $instanceJobMinify->addJob(SEARCH_PREFIX . 'minify', ['type' => 'js', 'keycache' => $keyCache, 'url' => $strDefaultJS, 'filename' => $filename]);
                } else {
                    $strDefaultJS = STATIC_URL . '/f/' . FRONTEND_TEMPLATE . '/staticCache/' . $keyCache . '.js';
                }
            }
            $renderer->headScript()->setAllowArbitraryAttributes(true)->offsetSetFile(1, $strDefaultJS, 'text/javascript');
        }

        //render external js
        if ($this->arrData['js']['extendJS']) {
            $tmp = 1;
            foreach ($this->arrData['js']['extendJS'] as $k => $strURL) {
                $tmp +=1;
                if ($this->isMin === 1) {
                    $keyCache = hash('crc32', $strURL) . '-v' . $version;
                    $filename = FRONTEND_STATIC_CACHE_PATH . '/' . $keyCache . '.js';
                    if (!file_exists($filename)) {
                        $instanceJobMinify->addJob(SEARCH_PREFIX . 'minify', ['type' => 'js', 'keycache' => $keyCache, 'url' => $strURL, 'filename' => $filename]);
                    } else {
                        $strURL = STATIC_URL . '/f/' . FRONTEND_TEMPLATE . '/staticCache/' . $keyCache . '.js';
                    }
                }
                $renderer->headScript()->setAllowArbitraryAttributes(true)->offsetSetFile($tmp, $strURL, 'text/javascript');
            }
        }
    }

}
