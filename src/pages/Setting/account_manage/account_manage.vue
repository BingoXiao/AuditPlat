<template>
    <div class="row">
        <div class="col-xs-11 col-xs-offset-0">
            <div class="form-inline">
                <br/>
                <div class="form-group">
                    <label for="userInput" class="control-label">用户账号：</label>
                    <div class="input-group input-group-sm">
                        <input id="userInput" type="text" class="form-control"/>
                        <span class="input-group-addon"><i class="iconfont icon-search"></i></span>
                    </div>
                </div>
                <div class="form-group stateFilter">
                    <label for="stateList" class="control-label">状态：</label>
                    <select id="stateList" class="text-center">
                        <option value="ALL">全部</option>
                        <option value="F">冻结</option>
                        <option value="T">启用</option>
                    </select>
                </div>

                <div class="col-xs-12 editBtn" style="margin-top:0;margin-bottom:10px">
                    <div class="row">
                        <div class="col-xs-6" style="padding-left:1px">
                            <button id="enableBtn" type="button" class="btn mybtn" style="margin-right:10px">启用</button>
                            <button id="frozenBtn" type="button" class="btn mybtn" style="margin-right:10px">冻结</button>
                            <button id="deleteBtn" type="button" class="btn mybtn">删除</button>
                        </div>

                        <div class="col-xs-6 text-right" style="padding-right:3px">
                            <button id="addUser" type="button" class="btn pull-right mybtn">添加用户</button>
                        </div>
                    </div>
                </div>
            </div>

            <!--用户信息表格详细-->
            <div class="row">
                <table id="accoutManageTable" class="table table-bordered text-center">
                    <thead>
                    <tr>
                        <th>&emsp;</th>
                        <th>姓名</th>
                        <th>用户账号</th>
                        <th>已开通服务</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody id="accountDetailList">
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</template>

<script>
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{

        }
    }
</script>

<style scoped>
    .input-group-addon{
        padding:3px 8px;
    }
</style>
