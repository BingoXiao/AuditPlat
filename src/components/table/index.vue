<template>
  <section>
    <template>
      <el-table :data="users" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" width="60"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120" sortable></el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex" sortable></el-table-column>
        <el-table-column prop="age" label="年龄" width="100" sortable></el-table-column>
        <el-table-column prop="birth" label="生日" width="120" sortable></el-table-column>
        <el-table-column prop="addr" label="地址" min-width="180" sortable></el-table-column>
        <el-table-column inline-template :context="_self" label="操作" width="150">
                    <span>
					    <el-button size="small" @click="handleEdit(row)">编辑</el-button>
					    <el-button type="danger" size="small" @click="handleDel(row)">删除</el-button>
                    </span>
        </el-table-column>
      </el-table>
    </template>

    <!--分页-->
    <el-col :span="24" class="toolbar" style="padding-bottom:10px;">
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20"
                     :total="total" style="float:right;"></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog :title="editFormTtile" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <!--<el-select v-model="editForm.sex" placeholder="请选择性别">
                      <el-option label="男" :value="1"></el-option>
                      <el-option label="女" :value="0"></el-option>
                  </el-select>-->
          <el-radio-group v-model="editForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="editForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">{{btnEditText}}</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<style>
    body{
        background-color:#ff0000;
    }
</style>
<script>
    import HeaderComponent from './components/header.vue'
    import OtherComponent from './components/other.vue'
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
            'other-component':OtherComponent,
            HeaderComponent,
        }
    }
</script>
