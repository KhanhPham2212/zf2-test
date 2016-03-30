<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Admincp;

return array(
    'router' => array(
        'routes' => array(
            'admincp' => array(
                'type' => 'segment',
                'options' => array(
                    'route' => '/backend/admincp[/:controller][/:action][/id/:id][/key/:key][/from/:from][/to/:to][/page/:page][/gid/:gid][/pid/:pid][/]',
                    'constraints' => array(
                        'module'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'action'     => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'         => '[0-9]*',
                        'page'       => '[0-9]*'
                    ),
                    'defaults' => array(
                        '__NAMESPACE__' => 'Admincp\Controller',
                        'module'        => 'admincp',
                        'controller'    => 'Index',
                        'action'        => 'Index',
                        'id'            => 0,
                        'page'          => 1
                    )
                )
            ),
        ),
    ),
    // Placeholder for console routes
    'console' => array(
        'router' => array(
            'routes' => array(
                'worker' => array(
                    'options' => array(
                        'route' => 'worker [--type=] [--background=] [--stop=] ',
                        'defaults' => array(
                            '__NAMESPACE__' => 'Admincp\Controller',
                            'controller' => 'console',
                            'action' => 'worker'
                        ),
                    ),
                ),
                'migrate' => array(
                    'options' => array(
                        'route' => 'migrate [--type=] [--createindex=]',
                        'defaults' => array(
                            '__NAMESPACE__' => 'Admincp\Controller',
                            'controller' => 'console',
                            'action' => 'migrate'
                        ),
                    ),
                ),
                'check-worker-running' => array(
                    'options' => array(
                        'route' => 'check-worker-running',
                        'defaults' => array(
                            '__NAMESPACE__' => 'Admincp\Controller',
                            'controller' => 'console',
                            'action' => 'check-worker-running'
                        ),
                    ),
                ),
            )
        )
    ),
    'service_manager' => array(
        'abstract_factories' => array(
            'Zend\Cache\Service\StorageCacheAbstractServiceFactory',
            'Zend\Log\LoggerAbstractServiceFactory',
        ),
        'factories' => array(
            'translator' => 'Zend\Mvc\Service\TranslatorServiceFactory',
        ),
    ),
    'translator' => array(
        'locale' => 'en_US',
        'translation_file_patterns' => array(
            array(
                'type'     => 'gettext',
                'base_dir' => __DIR__ . '/../language',
                'pattern'  => '%s.mo',
            ),
        ),
    ),
    'controllers' => array(
        'invokables' => array(
            'Admincp\Controller\Auth' => 'Admincp\Controller\AuthController',
            'Admincp\Controller\Console' => 'Admincp\Controller\ConsoleController',
            'Admincp\Controller\Index' => 'Admincp\Controller\IndexController',
            'Admincp\Controller\City' => 'Admincp\Controller\CityController',
            'Admincp\Controller\District' => 'Admincp\Controller\DistrictController',
            'Admincp\Controller\Ward' => 'Admincp\Controller\WardController',
            'Admincp\Controller\User' => 'Admincp\Controller\UserController',
        ),
    ),
    'view_helpers' => array(
        'invokables' => array(
            'paging' => 'My\View\Helper\Paging',
        )
    ),
    'module_layouts' => array(
        'Admincp' => 'admincp/layout'
    ),
    'view_manager' => array(
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => array(
            'admincp/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'admincp/error/accessDeny' => __DIR__ . '/../view/error/access-deny.phtml',
            'admincp/auth'             => __DIR__ . '/../view/layout/auth.phtml',
            'admincp/header'           => __DIR__ . '/../view/layout/header.phtml',
            'admincp/sidebar'          => __DIR__ . '/../view/layout/sidebar.phtml',
        ),
        'template_path_stack' => array(
            __DIR__ . '/../view',
        ),
    ),
);
