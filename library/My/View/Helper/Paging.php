<?php

/**
 * @author      :   VuNCD
 * @name        :   Backend_View_Helper_Paging
 * @version     :   1.0
 * @copyright   :   FPT Online
 * @todo        :
 */

namespace My\View\Helper;

use Zend\View\Helper\AbstractHelper;

class Paging extends AbstractHelper {

    public function __invoke($intTotal, $intCurrentPage, $intLimit, $strRoute, $arrParams = array()) {
        $paging = $this->paging($intTotal, $intCurrentPage, $intLimit, $strRoute, $arrParams);
        return $paging;
    }

    /**
     * Genegate HTML paging
     * @param <string> $strModule
     * @param <string> $strController
     * @param <string> $strAction
     * @param <array> $arrCondition
     * @param <int> $intTotal
     * @param <int> $intPage
     * @param <int> $intLimit
     * @param <string> $strRoute
     * @return <string> $result
     */
    public function paging($intTotal = 0, $intCurrentPage = 1, $intLimit = 15, $strRoute = null, $arrParams = array(), $str = 'kết quả') {
        $result = '';
        $urlHelper = '';
        $intTotal = (int) $intTotal;
        $intCurrentPage = (int) $intCurrentPage;
        $intLimit = (int) $intLimit;

        $strModule = strtolower($arrParams['module']);
        unset($arrParams['module']);

        $strController = strtolower($arrParams['__CONTROLLER__']);
        unset($arrParams['__CONTROLLER__']);

        $strAction = strtolower($arrParams['action']);
        unset($arrParams['action']);

        if (empty($strModule) || empty($strController) || empty($strAction) || $intTotal < 0) {
            return $result;
        }
        $intTotal > 0 && $intLimit > 0 ? $intTotalPage = ceil($intTotal / $intLimit) : $intTotalPage = 0;
        if ($intTotalPage < $intCurrentPage || $intTotalPage < 1) {
            return $result;
        }
        $urlHelper = $this->view->plugin('url');
        $arrCondition = array('controller' => $strController, 'action' => $strAction, 'page' => $intCurrentPage);
        $arrParams ? $arrCondition = $arrCondition + $arrParams : $arrCondition;

        $arrBackendModule = array('admincp', 'statistic', 'warehouse','newscp','accountant', 'shipment');
        $arrFrontendModule = array('customer', 'dashboard');
        if (in_array($strModule, $arrBackendModule)) {
            $serverUrl = $urlHelper('home', array(), array('force_canonical' => true));
            $serverUrl = substr($serverUrl, 0, -1);
            $result .= '<div style="text-align:center;">';
            $result .= '<ul class="pagination">';
            if ($intCurrentPage == 1) {
                $intPage = 1;
                $intLimitPage = 10;
            } else {
                $intPage = ($intCurrentPage > 5) ? ($intCurrentPage == $intTotalPage && $intTotalPage > 10) ? $intCurrentPage - 10 : $intCurrentPage - 5 : 1;
                $intLimitPage = ($intTotalPage < 11) ? $intTotalPage : $intCurrentPage + 5;
                $arrCondition['page'] = 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">« Đầu</a></li>';
                $arrCondition['page'] = $intCurrentPage - 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">← Trước</a></li>';
            }
            for ($intPage; $intPage <= $intTotalPage && $intPage <= $intLimitPage; $intPage++) {
                $arrCondition['page'] = $intPage;
                if ($intPage == $intCurrentPage) {
                    $result .= '<li class="active"><a style="">' . $intPage . '</a></li>';
                } else {
                    $result .= '<li><a rel="text" href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">' . $intPage . '</a></li>';
                }
            }
            if ($intCurrentPage == $intTotalPage) {
                $result .= '';
            } else {
                $arrCondition['page'] = $intCurrentPage + 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">Sau →</a></li>';
                $arrCondition['page'] = $intTotalPage;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">Cuối »</a></li>';
            }
            $result .= '</ul></div>';
            $result .='<div style="text-align:center;">';
            $from = ($intLimit * ($intCurrentPage - 1)) + 1;
            $tmp1 = 'Hiển thị từ ' . $from . ' đến ';
            $tmp2 = ($intLimit * $intCurrentPage > $intTotal) ? number_format($intTotal, 0, ',', '.') : $intLimit * $intCurrentPage;
            $tmp3 = ' trong tổng số ' . number_format($intTotal, 0, ',', '.') . ' ' . $str;
            $from == $intTotal ? $result .= $str . ' cuối cùng trong tổng số ' . number_format($intTotal, 0, ',', '.') . ' ' . $str : $result .= $tmp1 . $tmp2 . $tmp3;
            $result .= '</div>';
            ##################################################
//        } elseif ($strModule === 'frontend') {
        } elseif (in_array($strModule, $arrFrontendModule)) {
            $serverUrl = $urlHelper('home', array(), array('force_canonical' => true));
            $serverUrl = substr($serverUrl, 0, -1);
            $result .= '<div class="row"><div class="col-md-12 text-right">';
            $result .= '<ul class="pagination" style="width:auto;">';
            if ($intCurrentPage == 1) {
                $intPage = 1;
                $intLimitPage = 10;
            } else {
                $intPage = ($intCurrentPage > 5) ? ($intCurrentPage == $intTotalPage && $intTotalPage > 10) ? $intCurrentPage - 10 : $intCurrentPage - 5 : 1;
                $intLimitPage = ($intTotalPage < 11) ? $intTotalPage : $intCurrentPage + 5;
                $arrCondition['page'] = 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">đầu</a></li>';
                $arrCondition['page'] = $intCurrentPage - 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">trước</a></li>';
            }
            for ($intPage; $intPage <= $intTotalPage && $intPage <= $intLimitPage; $intPage++) {
                $arrCondition['page'] = $intPage;
                if ($intPage == $intCurrentPage) {
                    $result .= '<li class="active"><a style="cursor:pointer;">' . $intPage . '</a></li>';
                } else {
                    $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">' . $intPage . '</a></li>';
                }
            }
            if ($intCurrentPage == $intTotalPage) {
                $result .= '';
            } else {
                $arrCondition['page'] = $intCurrentPage + 1;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">sau</a></li>';
                $arrCondition['page'] = $intTotalPage;
                $result .= '<li><a href="' . $serverUrl . $urlHelper($strRoute, $arrCondition) . '">cuối</a></li>';
            }
            $result .= '</ul></div></div>';
        } elseif ($strModule === 'blog') {
            if ($intCurrentPage == 1) {
                $intPage = 1;
                $intLimitPage = 10;
            } else {
                $intPage = ($intCurrentPage > 5) ? ($intCurrentPage == $intTotalPage && $intTotalPage > 10) ? $intCurrentPage - 10 : $intCurrentPage - 5 : 1;
                $intLimitPage = ($intTotalPage < 11) ? $intTotalPage : $intCurrentPage + 5;
                $arrCondition['page'] = 1;
                $result .= '<a class="nextpostslink" href="' . $urlHelper($strRoute, $arrCondition) . '">Đầu</a>';
                $arrCondition['page'] = $intCurrentPage - 1;
                $result .= '<a class="last" href="' . $urlHelper($strRoute, $arrCondition) . '">Trước</a>';
            }

            for ($intPage; $intPage <= $intTotalPage && $intPage <= $intLimitPage; $intPage++) {
                $arrCondition['page'] = $intPage;
                if ($intPage == $intCurrentPage) {
                    $result .= '<span class="current">' . $intPage . '</span>';
                } else {
                    $result .= '<a class="page larger" href="' . $urlHelper($strRoute, $arrCondition) . '">' . $intPage . '</a>';
                }
            }
            if ($intCurrentPage == $intTotalPage) {
                $result .= '';
            } else {
                $arrCondition['page'] = $intCurrentPage + 1;
                $result .= '<a class="nextpostslink" href="' . $urlHelper($strRoute, $arrCondition) . '">Sau</a>';
                $arrCondition['page'] = $intTotalPage;
                $result .= '<a class="last" href="' . $urlHelper($strRoute, $arrCondition) . '">Cuối</a>';
            }
        }
        return $result;
    }

}
