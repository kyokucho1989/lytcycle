require 'rails_helper'

RSpec.describe 'AccessSimulation', type: :system do
  before do
    @user = User.create!(name: 'alice', email: 'alice@example.com', password: 'password',
                         confirmed_at: DateTime.now)
    @other_user = User.create!(name: 'bob', email: 'bob@example.com', password: 'password',
                               confirmed_at: DateTime.now)
    @ohter_users_simulation = @other_user.simulations.create!(title: 'test-simulation')
  end

  it 'cannot see other acounts new data', js: true do
    sign_in @user
    visit new_user_simulation_path(@other_user)
    expect(page).to have_content '他のユーザーのページにはアクセスできません。'
  end

  it 'cannot see other acounts edit data', js: true do
    sign_in @user
    visit edit_user_simulation_path(@other_user, @ohter_users_simulation)
    expect(page).to have_content '他のユーザーのページにはアクセスできません。'
  end

  it 'cannot see other acounts index data', js: true do
    sign_in @user
    visit user_simulations_path(@other_user)
    expect(page).to have_content '他のユーザーのページにはアクセスできません。'
  end
end
