<?php


/**
 * Description of Ajax
 *
 * @author admin
 */
class Ajax {

    //put your code here
    private $arr;

    public function __construct() {
        $this->arr = array(
            'version' => "1"
        );
    }

    public function param($paramname, $paramvalue) {
        $this->arr[$paramname] = $paramvalue;
        return $this;
    }

    public function form_error($value) {
        return $this->success(false)
                        ->param('form_error', $value);
    }

    public function form_errors($value) {
        return $this->success(false)
                        ->param('form_errors', $value);
    }

    public function success($value = true) {
        return $this->param('success', $value);
    }

    public function oncomplete($value) {
        return $this->param('completefn', $value);
    }

    public function form_reset($param = true) {
        return $this->param('form_reset', $param);
    }

    public function page_reload($param = true) {
        return $this->param('page_reload', $param);
    }

    public function redirect($param) {
        return $this->param('redirect', TRUE)
                        ->param('redirectURL', $param);
    }

    /**
     * 
     * @param string $message 
     * @param string $messagetext
     * @param tring $messagetype
     * Can be "warning", "error", "success" or "info"
     */
    public function message($message, $messagetext = "", $messagetype = "success") {
        return $this->param('message', true)
                        ->param('messageTitle', $message)
                        ->param('messageDescription', $messagetext)
                        ->param('messageType', $messagetype);
    }

    public function response($param = array()) {
        array_merge($this->arr, $param);
        if (isset($_REQUEST['callback'])) {
            echo filter_var($_REQUEST['callback'], FILTER_SANITIZE_STRING) . "(" . json_encode($this->arr) . ")";
        } else {
            echo json_encode($this->arr);
        }
        //
        die();
    }

}
