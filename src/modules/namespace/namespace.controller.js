const namespaceModel = require("../../models/Chat");
const { namespaceValidator , roomValidator } = require("./namespace.validator");

exports.getAll = async (req, res, next) => {
  try {
    const namespaces = await namespaceModel.find({}, { rooms: 0 }).lean();
    return res.status(200).json(namespaces);
  } catch (error) {
    next(error);
  }
};
exports.createNamespace = async (req, res, next) => {
  try {
    const { title, href } = req.body;

    await namespaceValidator.validate({ title, href });

    const existNamespace = await namespaceModel
      .findOne({
        $or: [{ title }, { href }],
      })
      .lean();

    if (existNamespace) {
      return res.status(400).json({ message: "the namespace exist already" });
    }

    await namespaceModel.create({ title, href });
    return res.status(201).json({message:'namespace created succcessfully'});
  } catch (error) {
    next(error);
  }
};
exports.createRoom = async (req, res, next) => {
  try {

    const {title , namespace} = req.body
    let image = null

    await roomValidator.validate({title,namespace})

    
    const existNamespace = await namespaceModel.findOne({href:namespace})

    if(!existNamespace){
      return res.status(404).json({message:'namespace not found'});
    }

    const existRoom = await namespaceModel.findOne({"rooms.title":title})

    if(existRoom){
      return res.status(400).json({message:'this room exist already'});
    }

    if(req.file){
      image = `/room/${req.file.filename}`
    }


    await namespaceModel.findOneAndUpdate({href:namespace},{
      $push:{
        rooms:{title , image: image ? image : undefined}
      }
    })
    return res.status(201).json({message:'room created successfully'});


  } catch (error) {
    next(error);
  }
};
