const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { ToyModel, validToy } = require('../models/toyModel');
const { authUser, authAdmin } = require('../middleware/auth');

//get all toys
router.get('/', async (req, res) => {
    let perPage = 10;
    let page = req.query.page;
    try {
        let toys = await ToyModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage);
        res.json(toys);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get('/search', async (req, res) => {
    let perPage = 10;
    let page = req.query.page /*|| 1*/;
    let toyName = req.query.name;
    let toyInfo = req.query.info;
    try {
        let toy;
        if (toyName) {
            toy = await ToyModel.find({ name: toyName })
                .limit(perPage)
                .skip((page - 1) * perPage);
        }
        else {
            toy = await ToyModel.find({ info: toyInfo })
                .limit(perPage)
                .skip((page - 1) * perPage);
        }
        res.json(toy);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

router.get('/search/:category_name', async (req, res) => {
    console.log("in category");
    let perPage = 10;
    let page = req.query.page;
    let toyCategory = req.params.category_name;
    try {
        let toy = await ToyModel.find({ category: toyCategory })
            .limit(perPage)
            .skip((page - 1) * perPage);
        res.json(toy);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//add toy
router.post('/', authUser, async (req, res) => {
    let validateToy = validToy(req.body);
    if (validateToy.error) {
        return res.status(400).json(validateUser.error.details);
    }
    try {
        let toy = await new ToyModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        res.status(200).send(toy)
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})

router.put('/:editId', authUser, async (req, res) => {
    let validateToy = validToy(req.body);
    if (validateToy.error) {
        return res.status(400).json(validateUser.error.details);
    }
    let toyId = req.params.editId;
    console.log(toyId);
    try {
        let toy = await ToyModel.updateOne({ user_id: req.tokenData._id, _id: toyId }, req.body);
        if (toy.modifiedCount == 0) {//לבדוק גם פה מה הסיבה
            res.status(500).send({ msg: "you cant edit this item" });
        }
        res.status(200).send(toy);
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})

router.delete('/:delId', authUser, async (req, res) => {
    let toyId = req.params.delId;
    try {//להוסיף בדיקה אם זה בגלל שהמוצר לר קיים או בגלל שהוא לא יצר אותו
        let toy = await ToyModel.deleteOne({ user_id: req.tokenData._id, _id: toyId });
        if (toy.deletedCount == 0) {
            res.status(500).send({ msg: "you cant delete this item" });
        }
        res.status(200).send(toy);
    }
    catch (err) {
        res.status(500).json({ msg: "err", err })
    }
})

//get toy by id
router.get('/single/:id', async (req, res) => {
    let id = req.params.id;
    try {
        let toy = await ToyModel.findOne({ _id: id })
        res.json(toy);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

//bonus
router.get('/prices', async (req, res) => {
    let perPage = 10;
    let page = req.query.page;
    let min = req.query.min;
    let max = req.query.max;
    try {
        let toy = await ToyModel.find({ price: { $gte: min, $lte: max } })
            .limit(perPage)
            .skip((page - 1) * perPage);
        res.json(toy);
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router;



