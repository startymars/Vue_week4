

// const modalBtn=document.querySelector("#modalBtn");
// const productModal=document.querySelector("#productModal");
let myModal="";
let deleteModal="";

import pagination from "./pagination.js";

const app=Vue.createApp({
    data(){
      return{
        apiUrl: 'https://vue3-course-api.hexschool.io/v2',
        apiPath: 'cream21',

        products: [],
        tempProduct: {
            imagesUrl:[],
        },
        isNew:false,    //  確認是編輯還是新增使用
        page:{}     //分頁
      }
    },
    methods:{
      //驗證是否登入
      checkLogin(){
       
        axios.post(`${this.apiUrl}/api/user/check`) 
        .then((res)=>{
            console.log(res);   
            //確認已驗證後呼叫getData()
            this.getData();
        })
        .catch((err)=>{
            console.dir(err);
            //確認驗證失敗，返回登入頁面
            window.location = 'login.html';
        })
      },
       //取得產品資料列表
      getData(page=1){    //參數預設值
        axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products/?page=${page}`)
          .then((res)=>{
             console.log(res.data.products);
            this.products=res.data.products; //將外部的products賦予給vue裡面的products
            this.page=res.data.pagination; //存取page的資訊到內部vue的page陣列
            console.log("22",this.page);
            console.log(res.data);
            console.log(this.products);
          })
          .catch((err)=>{
            console.log(err.data.message);
          })
      },
      //打開新增產品列表，並新增產品
      openModal(status,product){
        if(status==='create'){
            myModal.show();
            this.isNew=true;   
            //帶入初始化資料 
            this.tempProduct={
                imagesUrl:[],
            }
        }else if(status==="edit"){
            this.isNew=false;   
            //帶入要編輯的資料
            this.tempProduct={...product};  //因為傳參考特性，需使用物件展開
            console.log(this.tempProduct);
            myModal.show();
        }else if(status==="delete"){
            deleteModal.show();
            this.tempProduct={...product}; //取id做使用
        }
       
       
      },
      addData(){
        //用this.isNew判斷開啟哪個API
        let url=`${this.apiUrl}/api/${this.apiPath}/admin/product`;
        let method="post";
        if(!this.isNew){ //false編輯

            url=`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
            method='put';  
        } 

        axios[method](url,{data:this.tempProduct})
        .then((res)=>{
            console.log(res.data);
            this.getData();//將新增後的產品重新呼叫取得產品列表
            myModal.hide();//關閉modal
        })
        .catch((err)=>{
            console.dir(err);
        })

        

      },
      deleteProduct(){
        //用this.isNew判斷開啟哪個API
        const url=`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
    
        axios.delete(url)
        .then((res)=>{
            console.log(res.data);
            this.getData();//將新增後的產品重新呼叫取得產品列表
            deleteModal.hide();//關閉modal
        })
        .catch((err)=>{
            console.dir(err);
        })
      },
      createImages() {  //若原先沒有新增多圖，後續編輯才設置多圖，但一開始產品資料沒有tempProduct.imagesUrl陣列，所以後續加入的話要先建立陣列
        this.tempProduct.imagesUrl = [];
        this.tempProduct.imagesUrl.push('');
      },
  
    },
    components:{  //註冊模組化的元件的內容
      pagination
    },
    mounted(){
      //進入產品頁面初始化先進行的動作，取得token並放入headers
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)week2Token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      axios.defaults.headers.common['Authorization'] = token;
      this.checkLogin();

      myModal=new bootstrap.Modal(document.querySelector("#productModal"));

      deleteModal=new bootstrap.Modal(document.querySelector("#delProductModal"));
      
    }
  })
  app.component('product-modal',{
    props:['tempProduct','addData','deleteProduct','createImage'],
    template:'#modal-product'
  });

  app.mount("#app");