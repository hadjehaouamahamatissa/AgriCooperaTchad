// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cooperative: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cooperative',
    required: false
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unitPrice: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'preparing', 'shipped',
      'in_delivery', 'delivered', 'cancelled', 'refunded'
    ],
    default: 'pending'
  },
  shippingAddress: {
    fullName: String,
    phone: String,
    region: String,
    city: String,
    neighborhood: String,
    detailedAddress: String,
    instructions: String
  },
  payment: {
    method: {
      type: String,
      enum: ['mobile_money', 'stripe', 'cash', 'transfer', 'cooperative_credit'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentDate: Date,
    transactionId: String
  },
  delivery: {
    carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shippingDate: Date,
    estimatedDeliveryDate: Date,
    actualDeliveryDate: Date,
    trackingNumber: String,
    fees: { type: Number, default: 0 }
  },
  notes: String,
  desiredDeliveryDate: Date
}, {
  timestamps: true
});

// Génération automatique du numéro de commande
orderSchema.pre('save', async function(next) {
  try {
    if (this.isNew && !this.orderNumber) {
      // Générer un numéro de commande unique
      const timestamp = Date.now();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.orderNumber = `CMD${timestamp}${randomNum}`;
      
      console.log('📦 Numéro de commande généré:', this.orderNumber);
    }
    
    // Calcul des totaux - CORRECTION: unitPrice au lieu de unitePrice
    if (this.items && this.items.length > 0) {
      this.items.forEach(item => {
        if (item.quantity && item.unitPrice) {
          item.totalPrice = item.quantity * item.unitPrice;
        }
      });
      
      // Recalculer le montant total
      this.totalAmount = this.items.reduce((sum, item) => sum + (item.totalPrice || 0), 0) + (this.shippingFee || 0);
    }
    
    next();
  } catch (error) {
    console.error('Erreur dans pre-save middleware:', error);
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);