/*
 * @author: Spring
 * @create: 2021-05-25 12:34 PM
 * @license: MIT
 * @lastAuthor: Spring
 * @lastEditTime: 2021-05-25 12:34 PM
 * @desc: 
 */
var app = new Vue({
  el: '#app',
  data: {
    //历史数组
    historyArr:[],
    //记忆数组
    storageArr:[],
    arr: ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'],
    result: ''
  },
  mounted() {
    //判断是否有缓存
    if (localStorage.getItem('result')) {
      let result = localStorage.getItem('result')
      this.storageArr = JSON.parse(result)
      if(JSON.parse(result).length>10){
        this.historyArr=JSON.parse(result).slice(-10)
      }else{
        this.historyArr=JSON.parse(result)
      }
    }
  },
  methods: {
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
        if(/=/g.test(this.result) && !this.isnan(lastnum)){
          this.result=""
        }
      }
      this.result += item
      if(item=="."){
        let pointArr=this.result.split('.')
        if(pointArr.length==3 && !this.isnan(pointArr[1])){
          this.result=this.result.slice(0,-1)
          return
        }
        if(pointArr.length==4 && !this.isnan(pointArr[2])){
          this.result=this.result.slice(0,-1)
          return
        }
      }
      //等号事件
      if (item == "=") {
        //判断是否包含等号
        let resultArr=this.result.split('=')
        if(resultArr.length>2){
          this.result=this.result.slice(0,-1)
          return
        }
        //判断是否是 /0 的情况
        if(/\/0/g.test(this.result)){
          this.result+='0'
        }else{
          this.result += eval(this.result.slice(0, -1))
        }
        this.setStorage(this.result)
      }
    },

    //TODO 设置缓存
    setStorage(item) {
      //判断是否有历史记录
      if (localStorage.getItem('result')) {
        let result = localStorage.getItem('result')
        result = JSON.parse(result)
        result.push(item)
        if(result.length>50){
          result.shift()
        }
        this.historyArr=result.length>10?result.slice(-10):result
        result=JSON.stringify(result)
        localStorage.setItem('result', result)
        this.storageArr.push(item)
      }else{
        this.storageArr.push(item)
        this.historyArr.push(item)
        item = JSON.stringify([item])
        localStorage.setItem('result', item)
      }
    },

    //TODO 点击缓存
    clickStorage(item){
      this.result=item
    }
  },
})