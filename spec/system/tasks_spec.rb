require 'rails_helper'

RSpec.describe 'Widget', type: :system do
  before do
    @user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password')
  end

  it 'can see facility objects', js: true do
    sign_in @user
    visit new_user_simulation_path(@user)
    fill_in 'simulation[title]', with: 'machine'
    click_on 'save'
    assert_selector 'h1', text: 'Simulation一覧'
    click_on '編集'
    expect(page).to have_css 'circle#n0'
    expect(page).to have_css 'circle#n0'
    expect(page).to have_css 'circle#n2'
  end
end
