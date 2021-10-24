const express=require('express')
const router=express.Router()

const pool=require('../database')

router.get('/',(req,res)=>{
    res.render('./restaurants/search_resto')
})

module.exports=router