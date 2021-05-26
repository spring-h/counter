/*
 * @author: Spring
 * @create: 2021-05-26 09:01 AM
 * @license: MIT
 * @lastAuthor: Spring
 * @lastEditTime: 2021-05-26 13:07 PM
 * @desc: 
 */
var app = new Vue({
  el: '#app',
  data: {
    arr: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'],
    //历史数组
    historyArr:[],
    //记忆数组
    storageArr:[],
    //表达式
    result: '',
    //数字数组
    resultArr:[],
    //符号数组
    symbolArr:[]
  },
  mounted() {
    this.readStorage()
  },
  methods: {
    //TODO 操作缓存
    getS(name){
      return JSON.parse(localStorage.getItem(name))
    },
    setS(name,data){
      data=JSON.stringify(data)
      localStorage.setItem(name, data)
    },

    //TODO 页面加载读取缓存
    readStorage(){
      if (this.getS('result')) {
        //读取缓存
        let result = this.getS('result')
        this.storageArr = result
        //设置历史记录
        if(result.length>10){
          this.historyArr=result.slice(-10)
        }else{
          this.historyArr=result
        }
      }
    },

    //TODO 是否为NaN
    isnan(item){
      return isNaN(Number(item))
    },

    //TODO 点击按键
    click(item) {
      
      // 加减乘除 事件
      if( this.isnan(item) ){
        //判断最后一位是否为数字
        let last=this.result.slice(-1)
        if(this.isnan(last)||last==""){
          return
        }
        //判断是否包含 = 
        if(/=/g.test(this.result)){
          this.result=this.result.split('=')[1]
        }
      }
      // 数字
      if( !this.isnan(item) ){
        let lastnum=this.result.split('=')[1]
        //如果表达式已完成 再次输入数字 先清空表达式
        if(/=/g.test(this.result) && !this.isnan(lastnum)){
          this.result=""
        }
      }
      this.result += item
      //小数点
      if(item=="."){
        //判断小数点的个数
        let pointArr=this.result.split('.')
        //符号数量
        let symbolLength=1
        if(this.result.match(/[\+\-\*/]/g)!=null){
          symbolLength=this.result.match(/[\+\-\*/]/g).length
        }
        //判断是否有一个数字出现两个小数点的情况
        for (let i = 3; i <= symbolLength+3; i++) {
          if(pointArr.length==i && !this.isnan(pointArr[i-2])){
            this.result=this.result.slice(0,-1)
            return
          }
        }
      }
      //等号事件
      if (item == "=") {
        //判断是否包含等号
        if(this.result.match(/=/g).length>1){
          this.result=this.result.slice(0,-1)
          return
        }
        this.result=this.result.slice(0,-1)
        
        this.resultArr=this.result.split(/[\+\-\*/]/)
        this.symbolArr=this.result.match(/[\+\-\*/]/g)
        this.result=this.result+'='+this.multiplyDivid()
      }
    },

    //TODO 乘除运算
    multiplyDivid(){
      //查找书否含有 * /
      let index=this.symbolArr.findIndex(item=>item=='*'||item=='/')
      //没有 */ 直接算+- 
      if(index==-1){
        return this.addReduce()
      }else{
        let a;
        if(this.symbolArr[index]=='*'){
          a=Number(this.resultArr[index])*Number(this.resultArr[index+1])
        }
        if(this.symbolArr[index]=='/'){
          //判断是否为/0
          if(this.resultArr[index+1]==0){
            a=0
          }else{
            a=Number(this.resultArr[index])/Number(this.resultArr[index+1])
          }
        }
        //替换数字数组中已使用的元素
        this.resultArr.splice(index,2,a)
        //删除已使用的符号
        this.symbolArr.splice(index,1)
        return this.multiplyDivid()
      } 
    },

    //TODO 加减运算
    addReduce(){
      this.symbolArr.forEach((item,index)=>{
        let a
        if(item=='+'){
          a=Number(this.resultArr[0])+Number(this.resultArr[1])
        }
        if(item=='-'){
          a=Number(this.resultArr[0])-Number(this.resultArr[1])
        }
        this.resultArr.splice(0,2,a)
      })
      return this.resultArr[0]
    },

    //TODO 存入表达式
    setStorage(item) {
      //判断是否有历史记录
      if (this.getS('result')) {
        let result = this.getS('result')
        result.push(item)
        if(result.length>50){
          result.shift()
        }
        this.historyArr=result.length>10?result.slice(-10):result
        this.setS('result',result)
        this.storageArr.push(item)
      }else{
        this.storageArr.push(item)
        this.historyArr.push(item)
        this.setS('result',[item])
      }
    },

    //TODO 点击 历史 记忆
    clickStorage(item){
      this.result=item
    }

  },
})