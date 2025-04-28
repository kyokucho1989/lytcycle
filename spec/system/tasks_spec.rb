require 'rails_helper'

RSpec.describe 'Widget', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'can see facility objects', js: true do
    sign_in @confirmed_user
    visit new_user_simulation_path(@confirmed_user)
    click_on '結果確認'
    fill_in 'simulation[title]', with: 'machine'
    click_on 'データを保存'
    assert_selector 'h1', text: 'シミュレーション一覧'
    click_on '編集'
    expect(page).to have_css 'circle#start'
    expect(page).to have_css 'circle#n1'
    expect(page).to have_css 'circle#goal'
  end

  it 'can edit facility attributes', js: true do
    sign_in @confirmed_user
    visit new_user_simulation_path(@confirmed_user)
    find('circle#n1').click
    fill_in '設備名' , with: '変更後の設備名' ,fill_options: { clear: :backspace }
    fill_in '加工時間' , with: '30' ,fill_options: { clear: :backspace }
    click_on '保存'
    expect(page).to have_css 'circle#n1'
  end

  it 'can edit link attributes', js: true do
    sign_in @confirmed_user
    visit new_user_simulation_path(@confirmed_user)
    find('line#root1-1').click
    fill_in '距離' , with: '30' ,fill_options: { clear: :backspace }
    click_on '保存'
    expect(page).to have_css 'line#root1-1'
  end
end
