require 'rails_helper'

RSpec.describe 'Widget', type: :system do
  before do
    @user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password')
  end

  it 'can change facility value when save', js: true do
    sign_in @user
    visit new_user_simulation_path(@user)
    fill_in 'simulation[title]', with: 'machine'
    click_on 'save'
    assert_selector 'h1', text: 'Simulation一覧'
    click_on '編集'
    find('#n1').click
    fill_in '設備名', with: 'machine333'
    fill_in '加工時間', with: '30'
    click_on '保存'
    expect(page).to have_no_selector('設備名')
  end
end
