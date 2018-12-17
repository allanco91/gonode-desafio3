const Purchase = require('../models/Purchase')

class ApproveController {
  async update (req, res) {
    const { id } = req.params

    const { ad } = await Purchase.findById(id).populate({
      path: 'ad',
      populate: {
        path: 'author'
      }
    })

    if (ad.author.id !== req.userId) {
      res.status(401).json({ error: "You're not ad author" })
    }

    if (ad.purchasedBy) {
      res.status(400).json({ error: 'This Ad had already purchased' })
    }

    ad.purchasedBy = id

    await ad.save(ad)

    return res.json(ad)
  }
}

module.exports = new ApproveController()
