require 'rails_helper'

RSpec.describe 'Widget', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'can see facility objects', js: true do
    sign_in @confirmed_user
    visit new_user_simulation_path(@confirmed_user)
    fill_in 'simulation[title]', with: 'machine'
    click_on 'データを保存'
    assert_selector 'h1', text: 'シミュレーション一覧'
    click_on '編集'
    expect(page).to have_css 'circle#start'
    expect(page).to have_css 'circle#n1'
    expect(page).to have_css 'circle#goal'
  end
end
