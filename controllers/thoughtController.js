const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .select('-__v')
            .populate('reactions', '-__v -_id')
            .then((thought) => res.json(thought))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .populate('reactions', '-__v -_id')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no result with this id' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                    { username: thought.username },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                ).then((user) => { console.log(user) })
            }
            )
            .then(() => res.json({ message: 'thought created' }))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no result with this id' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err)
                return res.status(500).json(err)
            });
    },

    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'no result with this id' })
                    : res.json({ message: 'thought deleted' })
            )
            .catch((err) => {
                console.log(err)
                return res.status(500).json(err)
            })
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
            .then((reaction) =>
                !reaction
                    ? res.status(404).json({ message: 'no result with this id' })
                    : res.json(reaction)
            )
            .catch((err) => {
                console.log(err)
                return res.status(500).json(err)
            });
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then((reaction) =>
                !reaction
                    ? res.status(404).json({ message: 'no result with this id' })
                    : res.json({ message: 'reaction deleted' })
            )
            .catch((err) => {
                console.log(err)
                return res.status(500).json(err)
            });
    },

}