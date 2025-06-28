require 'rails_helper'

RSpec.describe 'RenderSVG', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'can see facility objects', js: true do
    sign_in @confirmed_user
    visit new_simulation_path
    sleep 3
    click_on '結果確認'
    fill_in 'simulation[title]', with: 'machine'
    click_on 'データを保存'
    assert_selector 'h1', text: 'シミュレーション一覧'
    click_on '編集'
    expect(page).to have_css 'circle#start'
    expect(page).to have_css 'circle#n1'
    expect(page).to have_css 'circle#goal'
  end
end

RSpec.describe 'EditObjects', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'can edit facility attributes', js: true do
    visit new_simulation_path
    sleep 3
    find('circle#n1').click
    fill_in '設備名', with: '変更後の設備名', fill_options: { clear: :backspace }
    fill_in '加工時間', with: '30', fill_options: { clear: :backspace }
    click_on '保存'
    expect(page).to have_css 'circle#n1'
  end

  it 'can edit link attributes', js: true do
    visit new_simulation_path
    sleep 3
    find('line#root1-1').click
    fill_in '距離', with: '30', fill_options: { clear: :backspace }
    click_on '保存'
    sleep 3
    find('line#root1-1').click
    expect(page).to have_css('line#root1-1', wait: 5, visible: :all)
  end
end

RSpec.describe 'AddDeleteObjects', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'can add and link facility', js: true do
    sign_in @confirmed_user
    visit new_simulation_path
    sleep 3
    find("label[for='add-facility']").click
    find('svg#svg02').click(x: 0, y: 0)
    sleep 3
    expect(page).to have_css 'circle#n4'
    find("label[for='add-link']").click
    find('circle#n1').click
    find('circle#n4').click
    sleep 3
    expect(page).to have_css('line#rootn1n4', visible: :all)
  end

  it 'can delete facility', js: true do
    sign_in @confirmed_user
    visit new_simulation_path
    sleep 3
    find("label[for='delete-object']").click
    find('circle#n1').click
    accept_alert

    expect(page).to have_no_css 'circle#n1'
  end
end

RSpec.describe 'DeletionErrors', type: :system do
  before do
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'cannot add duplicate goal and link', js: true do
    sign_in @confirmed_user
    visit new_simulation_path
    sleep 3
    find("label[for='add-link']").click
    find('circle#start').click
    find('circle#n1').click
    page.accept_confirm 'すでにリンクが作成されています'

    expect(page.text).to have_content 'シミュレーション一覧'
  end
end
