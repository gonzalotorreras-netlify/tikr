# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)



demoUser = User.create!(username:"DemoUser", email:'demoUser@tikr.app', fname:'Demo', lname:'User', funds:100000, password: "password123")

demoCompany = Company.create!(name: 'DemoCo', ticker:'DEMO')

demoTransaction = Transaction.create!(order_type: true, quantity: 10, company_id: demoCompany.id, user_id: demoUser.id, price: 50 )
demoTransaction = Transaction.create!(order_type: true, quantity: 20, company_id: demoCompany.id, user_id: demoUser.id, price: 100 )
demoTransaction = Transaction.create!(order_type: true, quantity: 30, company_id: demoCompany.id, user_id: demoUser.id, price: 150 )
demoTransaction = Transaction.create!(order_type: false, quantity: 10, company_id: demoCompany.id, user_id: demoUser.id, price: 100 )
demoTransaction = Transaction.create!(order_type: false, quantity: 10, company_id: demoCompany.id, user_id: demoUser.id, price: 50 )