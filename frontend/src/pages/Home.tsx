import { Link } from 'react-router-dom'
import { ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop & Earn with MLM</h1>
          <p className="text-xl mb-8 text-indigo-100">Buy electronics, clothes, groceries and earn commissions from your network</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50">
              Shop Now
            </Link>
            <Link to="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10">
              Join Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: ShoppingCart, title: 'Shop Products', desc: 'Browse our wide range of electronics, clothes, groceries and more' },
              { icon: Users, title: 'Build Your Team', desc: 'Refer friends and family to join your network' },
              { icon: DollarSign, title: 'Earn Commissions', desc: 'Get 10% direct referral + up to 5% from 4 levels deep' },
              { icon: TrendingUp, title: 'Grow Your Rank', desc: 'Earn PV points and unlock higher commission multipliers' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-gray-50">
                <item.icon className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Commission Structure</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[
              { level: 'Direct', percent: '10%' },
              { level: 'Level 1', percent: '5%' },
              { level: 'Level 2', percent: '3%' },
              { level: 'Level 3', percent: '2%' },
              { level: 'Level 4', percent: '1%' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow">
                <p className="text-sm text-gray-500">{item.level}</p>
                <p className="text-2xl font-bold text-indigo-600">{item.percent}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
