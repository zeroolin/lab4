/**
 * PersonController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // action - create
    create: async function (req, res) {
        if (req.method == "POST") {

            await Person.create(req.body.Person);
            return res.send("Successfully Created!");

        } else {
            return res.view('person/create');
        }
    },

    // action - index
    index: async function (req, res) {

        var persons = await Person.find();
        return res.view('person/index', { 'persons': persons });

    },

    // action - view
    view: async function (req, res) {

        var pid = parseInt(req.params.id) || -1;

        var model = await Person.findOne(pid);

        if (model != null)
            return res.view('person/view', { 'person': model });
        else
            return res.send("No such person");
    },

    // action - delete 
    delete: async function (req, res) {

        if (req.method == "POST") {
            const pid = parseInt(req.params.id) || -1;

            var models = await Person.destroy(pid).fetch();

            if (models.length > 0)
                return res.send("Person Deleted.");
            else
                return res.send("Person not found.");

        } else {
            return res.send("Request Forbidden");
        }
    },

    // action - update
update: async function (req, res) {

    var pid = parseInt(req.params.id) || -1;

    if (req.method == "GET") {
            
        var model = await Person.findOne(pid);

        if (model != null)
            return res.view('person/update', { 'person': model });
        else
            return res.send("No such person!");

    } else {
        
        var models = await Person.update(pid).set({
            name: req.body.Person.name,
            age: req.body.Person.age
        }).fetch();

        if (models.length > 0)
            return res.send("Record updated");
        else
            return res.send("No such person!");

    }
},

// action - search
search: async function (req, res) {

    const qName = req.query.name || "";
    const qAge = req.query.age || "";

    if (qAge == "") {

        var persons = await Person.find()
            .where({ name: { contains: qName } })
            .sort('name');

        return res.view('person/index', { 'persons': persons });

    } else {

        var persons = await Person.find()
            .where({ name: { contains: qName } })
            .where({ age: qAge })
            .sort('name');

        return res.view('person/index', { 'persons': persons });
    }
},

// action - paginate
paginate: async function (req, res) {

    const qPage = req.query.page - 1 || 0;
    
    const numOfItemsPerPage = 2;

    var persons = await Person.find().paginate(qPage, numOfItemsPerPage);

    var numOfPage = Math.ceil(await Person.count() / numOfItemsPerPage);

    return res.view('person/paginate', { 'persons': persons, 'count': numOfPage });
},

};

