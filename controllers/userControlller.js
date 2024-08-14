
const { where } = require('sequelize');
var db = require('../models')
var User = db.user;
var Contact = db.contact;
const { Sequelize, Op, QueryTypes} = require('sequelize');

var  addUser = async (req, res) =>{
    const jane = await User.create({ firstName: "Robin" ,lastName: "Singh"});
    //const jane = User.build({ firstName: "Jane" ,lastName: "singh"});
    console.log(jane instanceof User); // true
    console.log(jane.firstName); // "Jane"
    //jane.set({ firstName: "Anuj" ,lastName: "Kumar"});
    await jane.update({ firstName: "Arun" ,lastName: "Singha"});
    await jane.save();
    //await jane.save();
    console.log('Jane was saved to the database!');
    // await jane.destroy();
    await jane.reload();
    console.log(jane.toJSON());
    res.status(200).json(jane.toJSON());
}

var getUsers = async (req, res)=>{
    const data = await User.findAll({});
    res.status(200).json({data:data});
}

var getUser = async (req, res)=>{
    const data = await User.findOne({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
}

var postUsers = async (req, res)=>{
    var postData = req.body;
    if(postData.length>1){
        var data = await User.bulkCreate(postData);
    }else{
        var data = await User.create(postData);
    }
    res.status(200).json({data:data});
}

var deleteUser = async (req, res)=>{
    const data = await User.destroy({
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
}

var patchUser = async (req, res)=>{
    var updatedData = req.body;
    const data = await User.update(updatedData,{
        where:{
            id:req.params.id
        }
    });
    res.status(200).json({data:data});
}
// var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         attributes: { exclude:['firstName','lastName'],
//         include: ['id',[Sequelize.fn('COUNT', Sequelize.col('id')), 'count']]
//     }
//     });
//     res.status(200).json({data:data});
// }

//var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         where: {
//             [Op.and]: [
//                 { id: 1 },
//                 { firstName: 'Arun' }],
//         },
//       });
//     res.status(200).json({data:data});
// }

// var queryUser = async (req, res)=>{
//     const data = await User.findAll({
//         order: [
//             ['id','DESC']
//         ],
//         // group: 'lastName',
//         limit: 1,
//         offset: 1
//       });
//     res.status(200).json({data:data});
// }

var queryUser = async (req, res)=>{
    const data = await User.count({
        where: {
          id: {
            [Op.gt]: 3,
          },
        },
      });
    res.status(200).json({data:data});
}

var findersUser = async (req, res)=>{
    const {count, rows} = await User.findAndCountAll({
        where: { lastName: 'Singha' }
      });
    res.status(200).json({data:rows, count:count});
}

var getSetVirtualUser = async (req, res)=>{
    const data = await User.findAll({
        where: { lastName: 'Singha' }
      });
    // const data = await User.create({
    //     firstName: 'Naresh',
    //     lastName: 'Kumar'
    //   });
    res.status(200).json({data:data});
}

var validateUser = async (req, res) =>{
    var data={};
    var messages={};
    try{
        data = await User.create({
            firstName: 'a1234',
            lastName: 'Singha'
        });
    }catch(e){
        // console.log(e.errors)
        let message;
        e.errors.forEach(error => {
            switch(error.validatorKey){
                case 'isAlpha':
                    message=error.message
                    break;
                case 'isLowercase':
                    message='Only lowercase is allowed'
                    break;
                case 'len':
                    message='min 2 max 10 characters allowed'
                    break;
            }
            messages[error.path]=message
        });
    }
    res.status(200).json({data:data,messages:messages});
}

var rawQueriesUser = async (req, res) =>{
    const users = await db.sequelize.query('SELECT * FROM users WHERE id=$id', {
        bind: {id:'1'},
        type: QueryTypes.SELECT,
      });
    res.status(200).json({data:users});
}

var oneToOneUser = async (req, res) =>{
    // var data = await User.create({firstName:'gurmeet', lastName:'singh'})
    // if(data && data.id){
    //     await Contact.create({permanent_address:'abc', current_address:'xyz',
    //         'user_id':data.id
    //     })
    // }
    // var data = await User.findAll({
    //     attributes: ['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as: 'contactDetails',
    //         attributes:['permanent_address','current_address']
    //     }],
    //     where:{id:2}
    // })
    // res.status(200).json({data:data});
    var data = await Contact.findAll({
        attributes: ['permanent_address','current_address']['firstName','lastName'],
        include:[{
            model:User,
            as: 'userDetails',
            attributes:['firstName','lastName']
        }],
        where:{id:2}
    })
    res.status(200).json({data:data});
}
var oneToManyUser = async (req,res)=>{
    // await Contact.create({permanent_address:'Gurugram', current_address:'Merath',
    //     'user_id':1
    // })
    // var data = await User.findAll({
    //     attributes: ['firstName','lastName'],
    //     include:[{
    //         model:Contact,
    //         as: 'contactDetails',
    //         attributes:['permanent_address','current_address']
    //     }]
    // })
    var data = await Contact.findAll({
        attributes: ['permanent_address','current_address']['firstName','lastName'],
        include:[{
            model:User,
            as: 'userDetails',
            attributes:['firstName','lastName']
        }]
    })
    res.status(200).json({data:data});
}

var manyToManyUser = async (req,res)=>{
    // var data = await User.create({firstName:'arun', lastName:'gupta'})
    // if(data && data.id){
    //     await Contact.create({permanent_address:'noida', current_address:'hapur'
    //     })
    // }
    // var data = {}
    // var data = await Contact.findAll({
    //     attributes: ['permanent_address','current_address'],
    //     include:[{
    //         model:User,
    //         attributes:['firstName','lastName']
    //     }]
    // })
    var data = await User.findAll({
        attributes: ['firstName','lastName'],
        include:[{
            model:Contact,
            attributes:['permanent_address','current_address']
        }]
    })
    res.status(200).json({data:data});
}

module.exports={
    addUser,
    getUsers,
    getUser,
    postUsers,
    deleteUser,
    patchUser,
    queryUser,
    findersUser,
    getSetVirtualUser,
    validateUser,
    rawQueriesUser,
    oneToOneUser,
    oneToManyUser,
    manyToManyUser
}
