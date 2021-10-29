const express=require('express')
const router=express.Router()
const pool=require('../database')

router.get('/',(req,res)=>{
    res.render('./accommodations/search_accommodations')
})

router.get('/detalles',(req,res)=>{
    res.render('./accommodations/details_accommodations')
})
module.exports=router