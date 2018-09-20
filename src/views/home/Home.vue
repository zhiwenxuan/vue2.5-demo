<template>
  <div class="bs-home" v-loading.body="loading">
    <!-- 其他路由展示 -->
    <transition name="router-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    
    <!-- home/main -->
    <div class="main">
      <div id="gallery-view">
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12" :md="8" :lg="6"
            v-for="product of products"
            :key="product.productId"
            >
              <div class="card placed raisable gallery-view-card">
                <div class="main-image" :style="`background:url(${defaultImage}) no-repeat center/cover`"></div>
                <div class="text-container-bottom-block">
                  <p class="title">{{ product.city }}, {{ product.state }}</p>
                  <div style="display: flex">
                    <p class="body-text" style="flex: 1;">{{ product.productId }}</p>
                    <el-tooltip class="item" effect="dark" content="Add to basket" placement="bottom-end">
                      <i class="el-icon-circle-plus btn-add-product" @click="addProduct"></i>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
    </div>

    <!-- home/footer -->
    <div class="footer">
       <el-pagination @size-change="onPageSizeChange" @current-change="onCurrentPageChange" :current-page.sync="searchParam.pageIndex"
        :page-sizes="[24, 30, 36, 42]" :page-size="searchParam.pageSize" layout="total, sizes, prev, pager, next" :total="productsCount">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      loading: false,
      searchParam: {
        pageIndex: 1,
        pageSize: 24
      },
      productsCount: 100,
      defaultImage: require("@/assets/images/p.jpg"),
      products: []
    };
  },
  created() {
    this.initProducts(0, this.searchParam.pageSize);
  },
  methods: {
    //初始化产品
    initProducts(begin, end) {
      //启动加载条
      this.loading = true;
      //这里应该从后台取数据，而且只取当前页面的数据，目前只是模拟数据
      end = Math.min(end, this.productsCount);
      this.products = [];
      setTimeout(() => {
        for (let i = begin; i < end; i++) {
          this.products.push({
            productId: 10000 + i + 1,
            address: "SZ" + i + 1,
            state: "CHINA",
            city: "SZ"
          });
        }
        //关闭加载条
        this.loading = false;
      }, 500);
    },
    //一个页面展示产品的数目的变化
    onPageSizeChange(size) {
      //TODO 这里应该要后台取数据
      this.searchParam.pageIndex = 1;
      this.searchParam.pageSize = size;
      let begin = (this.searchParam.pageIndex - 1) * this.searchParam.pageSize;
      let end = this.searchParam.pageIndex * this.searchParam.pageSize;
      this.initProducts(begin, end);
    },
    //页面下标切换
    onCurrentPageChange(index) {
      //TODO 这里应该要后台取数据
      this.searchParam.pageIndex = index;
      let begin = (this.searchParam.pageIndex - 1) * this.searchParam.pageSize;
      let end = this.searchParam.pageIndex * this.searchParam.pageSize;
      this.initProducts(begin, end);
    },
    addProduct() {
      this.$store.commit("addProduct");
    }
  }
};
</script>

<style lang="scss" scoped>
.bs-home {
  display: flex;
  flex: auto 1 1;
  flex-direction: column;

  .main {
    display: flex;
    flex-direction: column;
    flex: auto 1 1;
  }

  .footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 0 0 52px;
    position: relative;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.23);
    background-color: #fff;
  }
}
#gallery-view {
  height: 100%;
  width: 100%;
  margin: auto;
  padding: 8px 24px;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}
#gallery-view .card.raisable:hover {
  background-color: #fff;
}
#gallery-view .gallery-view-card {
  margin: 16px 0;
  background-color: #ffffff80;
}
.main-image {
  padding-top: 56%;
  position: relative;
  cursor: pointer;
}
.text-container-float-mask {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.64), rgba(0, 0, 0, 0));
  font-size: 14px;
  position: absolute;
  top: 0;
  width: 100%;
  padding: 8px;
  line-height: 1.2;
}
.text-container-bottom-block {
  font-size: 14px;
  color: #000;
  width: 100%;
  padding: 16px;
  line-height: 1.2;
  background-color: #fff;
}
.title {
  opacity: 0.87;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.75;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.body-text {
  opacity: 0.87;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
.caption {
  opacity: 0.54;
  font-size: 11px;
}
.btn-add-product {
  font-size: 20px;
  color: #60bb74;
  cursor: pointer;
  &:hover {
    color: #4bda6b;
  }
}
</style>
