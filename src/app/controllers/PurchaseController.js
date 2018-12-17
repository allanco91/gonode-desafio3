const Ad = require('../models/Ad')
const User = require('../models/User')
const Purchase = require('../models/Purchase')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async index (req, res) {
    const purchases = await Purchase.find().populate(
      [
        {
          path: 'ad',
          match: { author: req.userId }
        },
        'buyer'
      ])

    if (purchases[0].ad === null) {
      return res.send()
    }

    return res.json(purchases)
  }

  async store (req, res) {
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    const purchase = await Purchase.create({ ad, buyer: user.id, content })

    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.json(purchase)
  }
}

module.exports = new PurchaseController()
