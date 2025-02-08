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
    expect(page).to have_css 'circle#start'
    expect(page).to have_css 'circle#\\31'
    expect(page).to have_css 'circle#goal'
  end

  it 'can not fire click event in simulation mode', js: true do
    sign_in @user
    visit new_user_simulation_path(@user)
    accept_alert '整合性チェックOK' do
      click_on '整合性確認'
    end
    expect(page).to have_no_selector 'input#simulateMode[disabled]'
  end
end
