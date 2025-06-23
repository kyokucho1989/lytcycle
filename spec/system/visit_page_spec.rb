require 'rails_helper'

RSpec.describe 'VisitSimulationPage', type: :system do
  before do
    driven_by(:rack_test)
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'visiting the index simulation when sign in' do
    sign_in @confirmed_user
    visit simulations_path(@confirmed_user)
    assert_selector 'h1', text: 'シミュレーション一覧'
  end

  it 'redirect index simulation when sign in' do
    sign_in @confirmed_user
    visit root_path
    assert_selector 'h1', text: 'シミュレーション一覧'
  end
end

RSpec.describe 'VisitOtherPage', type: :system do
  before do
    driven_by(:rack_test)
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'visiting the root and demo page' do
    visit root_path
    assert_selector 'h1', text: '工場最適化の第一歩'

    find('button#upper-demo').click
    assert_selector 'h1', text: 'デモ'

    visit root_path
    find('button#lower-demo').click
    assert_selector 'h1', text: 'デモ'
  end

  it 'visiting the privacy policy page' do
    visit root_path
    click_on('プライバシーポリシー')
    assert_selector 'h1', text: 'プライバシーポリシー'
  end

  it 'visiting the term page' do
    visit root_path
    click_on('利用規約')
    assert_selector 'h1', text: '利用規約'
  end
end
