<?php
/**
 * 用户小游戏
 * @author lijianlin
 * 
 * 游戏结束，1没有返回数据， 
 * 
 * init接口，如果登录了，把我的奖品一起返回
 * 
 *
 *
 */
class ActivityusergameController extends \App\Library\ControllerAbstract {
    
    
    /**
     * 小游戏初始化页面
     */
    public function getCommonAction(){
        //验证用户是否登陆
        $user_id = $this->_checkUser();
        if (empty($user_id)) {
            $this->echoJson(403, '用户未登录');
        }

        //小游戏活动是否开始
        $now = time();
        $userGameConf = \Conf\Config::getConfig('USER_GAME', 1);
        $isStart = $now >= strtotime($userGameConf['startTime']) && $now <= strtotime($userGameConf['endTime']);
        if (!($isStart || in_array($user_id, $userGameConf['whiteList']))) {
            $this->echoJson(504, '现在不在活动期间');
        }

        $shareToken = \App\Library\StringEncrypt::encode($user_id);
        //获取用户当前可用的游戏机会
        $userGameResObj = new \App\Models\Once\ActivityUserGameResources();
        $userGameRet = $userGameResObj->find($user_id);
        if (empty($userGameRet)) {
            //新用户参与游戏
            $userApi = new \App\Library\UserCenter\User();
            $userInfo = $userApi->getUserFieldsByUserId($user_id, ['name', 'cellphone', 'city']);
            if (empty($userInfo)) {
                $this->echoJson(500, '用户信息为空');
            }

            $insertData = [
                'user_id' => $user_id,
                'name'    => $userInfo['name'],
                'cellphone'=> $userInfo['cellphone'],
                'location'=> $userInfo['city'],
                'total_num' => 1,
                'remain_num' => 1
            ];
            if ($userGameResObj->insert($insertData)) {
                $this->echoJson(200, '成功', ['gameNum'=>1, 'shareToken'=>$shareToken]);
            } else {
                $this->echoJson(507, '访问频率过快');
            }
        } else {
            $this->echoJson(200, '成功', ['gameNum'=>$userGameRet['remain_num'], 'shareToken'=>$shareToken]);
        }
        
    }
    
    
    /**
     * 用户开始游戏操作
     */
    public function startGameAction(){
        //验证用户是否登陆
        $user_id = $this->_checkUser();
        if (empty($user_id)) {
            $this->echoJson(403, '用户未登录');
        }
        
        //小游戏活动是否开始
        $now = time();
        $userGameConf = \Conf\Config::getConfig('USER_GAME', 1);
        $isStart = $now >= strtotime($userGameConf['startTime']) && $now <= strtotime($userGameConf['endTime']);
        if (!($isStart || in_array($user_id, $userGameConf['whiteList']))) {
            $this->echoJson(504, '现在不在活动期间');
        }

        //检查用户游戏机会数
        $userGameResObj = new \App\Models\Once\ActivityUserGameResources();
        $userGameRet = $userGameResObj->find($user_id);
        if (empty($userGameRet)) {
            $this->echoJson(401, '请从正常渠道参与游戏');
        }
        if ($userGameRet['remain_num'] <= 0 || !$userGameResObj->update(['remain_num[-]'=>1], ['AND'=>['user_id' => $user_id]])) {
            $this->echoJson(602, '没有游戏机会了');
        }
        
        $userGameAwardObj = new \App\Models\Once\ActivityUserGameAward();
        $insertData = [
            'user_id'   => $user_id,
            'name'      => $userGameRet['name'],
            'cellphone' => $userGameRet['cellphone'],
            'start_time'=> $now
        ];
        $id = $userGameAwardObj->insert($insertData);
        if ($id) {
            $gameToken = \App\Library\StringEncrypt::encode($id.'|'.$user_id.'|'.\App\Library\StringEncrypt::TOKEN);
            $this->echoJson(200, '开始游戏', ['gameToken'=>$gameToken]);
        } else {
            $this->echoJson(503, '服务器正在偷懒，请稍后重试');
        }
        
    }
    
    /**
     * 用户结束游戏操作
     */
    public function endGameAction(){
        //验证用户是否登陆
        $user_id = $this->_checkUser();
        if (empty($user_id)) {
            $this->echoJson(403, '用户未登录');
        }

        //小游戏活动是否已经开始了
        $now = time();
        $userGameConf = \Conf\Config::getConfig('USER_GAME', 1);
        $isStart = $now >= strtotime($userGameConf['startTime']);
        if (!($isStart || in_array($user_id, $userGameConf['whiteList']))) {
            $this->echoJson(504, '现在不在活动期间');
        }
        
        //获取前端传过来的参数
        $gameToken = $this->input->get('gameToken',true);
        $goldNum = $this->input->get('goldNum',true);
        $goldNum = $goldNum ? $goldNum>0 ? $goldNum : 0 : 0;
        if (empty($gameToken)) {
            $this->echoJson(400, '参数不正确');
        }

        //如果本次金币数超过了限制的数量
        if ($goldNum > $userGameConf['goldLimitNum']) {
            $this->echoJson(400, '参数不正确');
        }
        
        //解析gameToken
        $tokenArr = explode('|', \App\Library\StringEncrypt::decode($gameToken));
        if (count($tokenArr) != 3){
            $this->echoJson(400, '参数不正确');
        }
        
        $id = $tokenArr[0];
        $tokenUserId = $tokenArr[1];
        $token = $tokenArr[2];
        if ($user_id != $tokenUserId || $token != \App\Library\StringEncrypt::TOKEN) {
            $this->echoJson(400, '参数不正确');
        }
        
        $userGameResObj = new \App\Models\Once\ActivityUserGameResources();
        $userGameRet = $userGameResObj->find($user_id);
        if (empty($userGameRet)) {
            $this->echoJson(401, '请从正常渠道参与游戏');
        }

        $where['AND'] = ['id'=>$id, 'user_id'=>$user_id, 'status'=>0];
        $userGameAwardObj = new \App\Models\Once\ActivityUserGameAward();
        $userGameAwardRet = $userGameAwardObj->fetchRow($where);
        if (empty($userGameAwardRet)) {
            $this->echoJson(400, '参数不正确');
        }

        //计算所获优惠券类型
        $couponId = 0;
        foreach($userGameConf['couponInfo'] as $key=>$value) {
            if ($goldNum >= $value[0] && $goldNum < $value[1]) {
                $couponId = $key;
                break;
            }
        }
        
        //更新用户金币总数
        if (!$userGameAwardObj->update(['gold_num'=>$goldNum, 'award'=>$couponId, 'end_time'=>$now, 'status'=>2], $where)){
            $this->echoJson(400, '参数不正确');
        }
        if (!empty($goldNum)){
            if (!$userGameResObj->update(['total_gold_num[+]'=>$goldNum], ['AND'=>['user_id'=>$user_id]])) {
                $this->echoJson(503, '服务器正在偷懒，请稍后重试');
            }
        }

        //如果获得优惠券着需要发送优惠券
        $flag = true;
        if (!empty($couponId)) {
            $couponObj = new \App\Library\UserCenter\Coupon();
            $flag = $couponObj->send($user_id,[['coupon_id'=>$couponId, 'coupon_num'=>1]],'2017用户小游戏');
        }
        
        //标记优惠券发送状态
        if ($flag){
            $userGameAwardObj->update(['status'=>3], ['AND'=>['id'=>$id, 'user_id'=>$user_id, 'status'=>2]]);
        }
        
        $this->echoJson(200, '成功');

    }
    
    
   /**
     * 小游戏助力接口
     */
    public function helpUserAction(){
        //验证用户是否登陆
        $helpUserId = $this->_checkUser();
        if (empty($helpUserId)) {
            $this->echoJson(403, '用户未登录');
        }

        //小游戏活动是否开始
        $now = time();
        $userGameConf = \Conf\Config::getConfig('USER_GAME', 1);
        $isStart = $now >= strtotime($userGameConf['startTime']) && $now <= strtotime($userGameConf['endTime']);
        if (!($isStart || in_array($helpUserId, $userGameConf['whiteList']))) {
            $this->echoJson(504, '现在不在活动期间');
        }

        //获取客户端传过来的参数
        $shareToken = $this->input->get('shareToken',true);
        $helpedUserId = \App\Library\StringEncrypt::decode($shareToken);
        $userGameResObj = new \App\Models\Once\ActivityUserGameResources();
        $helpedUserGameRet = $userGameResObj->find($helpedUserId);
        if (!(!empty($shareToken) && !empty($helpedUserId) && !empty($helpedUserGameRet))) {
            $this->echoJson(400, 'shareToken参数错误');
        }

        //首先检测助力人当天是否已经助力过操作  (助力者一天只能一次)
        $currentDayTime = strtotime(date('Y-m-d'));
        $userGameHelObj = new \App\Models\Once\ActivityUserGameHelp();
        if ($userGameHelObj->fetchRow(['AND'=>['help_user_id'=>$helpUserId, 'current_day_time'=>$currentDayTime]])) {
            $this->echoJson(600, '助力次数到达上线');
        }
        
        //检测被助力人当天被助力次数是否到达上线  (一天限制四次)
        $helpedCount = $userGameHelObj->count(['AND'=>['helped_user_id'=>$helpedUserId, 'current_day_time'=>$currentDayTime]]);
        if ($helpedCount >= 4) {
            $this->echoJson(601, '被助力次数到达上线');
        }

        $userApi = new \App\Library\UserCenter\User();
        $helpUserInfo   = $userApi->getUserFieldsByUserId($helpUserId, ['name', 'cellphone', 'city']);
        $helpedUserInfo = $userApi->getUserFieldsByUserId($helpedUserId, ['name', 'cellphone', 'city']);
        if (!(!empty($helpUserInfo) && !empty($helpedUserInfo))) {
            $this->echoJson(500, '用户信息为空');
        }

        $insertHelpData = [
            'help_user_id' => $helpUserId,
            'help_name' => $helpUserInfo['name'],
            'help_cellphone' => $helpUserInfo['cellphone'],
            'helped_user_id' => $helpedUserId,
            'helped_name' => $helpedUserInfo['name'],
            'helped_cellphone' => $helpedUserInfo['cellphone'],
            'help_time' => $now,
            'current_day_time' => $currentDayTime,
        ];
        if (!$userGameHelObj->insert($insertHelpData)){
            $this->echoJson(503, '服务器正在偷懒，请稍后重试');
        }
        
        //更新助力者和被助力者游戏机会数
        if (!$userGameResObj->update(['total_num[+]'=>1,'remain_num[+]'=>1], ['AND'=>['user_id' => $helpedUserId]])){
            $this->echoJson(503, '服务器正在偷懒，请稍后重试');
        }
        
        $helpUserGameRet = [];
        $helpUserGameRet = $userGameResObj->find($helpUserId);
        if ($helpUserGameRet){
            $helpUserGameRet['remain_num'] += 1;
            if (!$userGameResObj->update(['total_num[+]'=>1,'remain_num[+]'=>1], ['AND'=>['user_id' => $helpUserId]])){
                $this->echoJson(503, '服务器正在偷懒，请稍后重试');
            }
        } else {
            $helpUserGameRet['remain_num'] = 2;
            $insertResData = [
                'user_id' => $helpUserId,
                'name'    => $helpUserInfo['name'],
                'cellphone'=> $helpUserInfo['cellphone'],
                'location'=> $helpUserInfo['city'],
                'total_num' => 2,
                'remain_num' => 2
            ];
            if (!$userGameResObj->insert($insertResData)){
                $this->echoJson(503, '服务器正在偷懒，请稍后重试');
            }
        }
        
        $helpShareToken = \App\Library\StringEncrypt::encode($helpUserId);
        $this->echoJson(200, '助力成功', ['gameNum'=>$helpUserGameRet['remain_num'], 'shareToken'=>$helpShareToken]);

    }

    //检查用户登录
    protected function _checkUser(){
        $user_id    =  \App\Library\User::getLoginUserId();
        if(!$user_id){
            $webuserapi = new \App\Library\UserCenter\WebUser();
            $user_id = $webuserapi->getIdentity();
            $user_id = $user_id ? $user_id : 0;
        }
    
        return $user_id;
    }
}
