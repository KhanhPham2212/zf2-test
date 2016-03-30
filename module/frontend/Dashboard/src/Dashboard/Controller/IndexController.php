<?php
/**
 * Zend Framework (http://framework.zend.com/)
 *
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2015 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */

namespace Dashboard\Controller;

use My\Controller\MyController;

class IndexController extends MyController
{
    public function indexAction()
    {
        $params = $this->params()->fromRoute();
        return [
            'params' => $params
        ];
    }
}
