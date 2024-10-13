<template>
  <el-container class="container mx-auto p-4">
    <el-header>
      <h1 style="margin: 0;" class="text-2xl font-bold text-center text-blue-600">
        开放题-智慧芽专利搜索
      </h1>
    </el-header>
    <el-main>
      <el-row class="mb-4">
        <el-col :span="24">
          <el-input
            v-model="apiKey"
            placeholder="输入 API Key"
            class="w-full"
          />
        </el-col>
      </el-row>

      <el-row class="mb-4">
        <el-col :span="24">
          <el-input
            v-model="secretKey"
            placeholder="输入 Secret Key"
            class="w-full"
          />
        </el-col>
      </el-row>

      <div class="flex items-center mb-4">
        <!-- style="width: 240px" -->
        <el-input
          v-model="searchTerm"
          placeholder="搜索专利"
          class="w-full flex-grow mr-2"
        />
        <el-row class="mb-4">
          <el-col :span="24">
            <el-button 
              size="large" 
              type="primary" 
              @click="search"
              style="width: 100%;"
              >
              搜索
            </el-button>
          </el-col>
        </el-row>
      </div>
      <p class="mb-4">共找到 {{ totalResults }} 条结果</p>
      <el-table :data="patents" style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="50"
        />
        <el-table-column
          prop="pn"
          label="专利号"
          width="160"
        />
        <el-table-column
          prop="title"
          label="标题"
        />
        <el-table-column
          prop="applicant"
          label="申请人"
        />
        <el-table-column
          prop="inventor"
          label="发明人"
        />
        <el-table-column
          prop="applicationDate"
          label="申请日期"
        />
        <el-table-column
          prop="publicationDate"
          label="公开日期"
        />
      </el-table>
      <div class="flex items-center justify-between mt-4">
        <div class="text-gray-600">10条/每页</div> <!-- 显示每页条数的文本 -->
        <el-pagination
          @current-change="setCurrentPage"
          :current-page="currentPage"
          :page-size="10"
          :total="totalResults"
          layout="prev, pager, next"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../../api/axios'

const apiKey = ref('7v9mr4lgjwffkxwhdt935b03cx0186mttie0mqfmssgys7fi')
const secretKey = ref('hwxk3lrdrc52jfuh833qeo1b1v9dqyd6wy4ud9api93gmssk8wahffsct30a6p01')
const token = ref(null)
const searchTerm = ref('华为')
const currentPage = ref(1)
const totalResults = ref(0)

const patents = ref([
  {
    id: 1,
    pn: "CN111737210A",
    title: "一种华为手机摄像图提取方法、装置及电子设备",
    applicant: "深圳软件科技集团股份有限公司",
    inventor: "孙丽宇盛",
    applicationDate: "20200624",
    publicationDate: "20201002",
  },
  {
    id: 2,
    pn: "CN117692316A",
    title: "一种用于华为云平台搜索服务的服务器接入部署方法",
    applicant: "中国人寿保险股份有限公司上海数据中心",
    inventor: "富海军林志鹏李永海潘佳朝宇孙王婷",
    applicationDate: "20231212",
    publicationDate: "20240312",
  },
  // 其他专利数据...
])

// 获取 token 的函数
const fetchToken = async () => {
  try {
    const response = await axios.post('/token', {
      clientID: apiKey.value,
      clientSecret: secretKey.value,
    });
    token.value = response; // 假设响应中有 token 字段
    console.log('获取的 token:', token.value);
  } catch (error) {
    console.error('获取 token 错误:', error);
  }
};

// 使用 token 的函数
const fetchDataWithToken = async () => {
  try {
    const response = await axios.post('/semantic-search-patent', {
        limit: 10,
        apd_to: "20220101",
        offset: (currentPage.value - 1) * 10,
        pbd_to: "20220101",
        country: ["CNA", "CNB"],
        apd_from: "20200101",
        pbd_from: "20200101",
        relevancy: "50%",
        text: searchTerm.value,
        token: token.value,
        api_key: apiKey.value
    });
    console.log('第二个请求的响应:', response);
    totalResults.value = response.total_search_result_count;
    patents.value = response.results;
  } catch (error) {
    console.error('第二个请求错误:', error);
  }
};

const search = async () => {
  // 实现搜索功能
  console.log('Searching for:', searchTerm.value)
  console.log('API Key:', apiKey.value)
  console.log('Secret Key:', secretKey.value)
  await fetchToken(); // 先获取 token
  if (token.value) { // 确保 token 存在后再执行下一个请求
    await fetchDataWithToken(); // 然后使用 token 发起请求
  }
}

const setCurrentPage = (page) => {
  currentPage.value = page
  console.log('Changed to page:', page)
  search();
}
</script>

<style scoped>
/* 添加你的样式 */
</style>