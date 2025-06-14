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

RSpec.describe 'SaveSimulation', type: :system do
  before do
    @user = User.create!(name: 'alice', email: 'alice@example.com', password: 'password',
                         confirmed_at: DateTime.now)
    @users_simulation = @user.simulations.create!(title: 'test-simulation')
  end

  it 'can create new simulation', js: true do
    sign_in @user
    visit user_simulations_path(@user)
    click_on('新規作成')
    click_on('結果確認/保存へ')
    fill_in 'simulation[title]', with: '生産ラインA'
    click_on('データを保存')
    expect(page).to have_content 'シミュレーションが作成されました。'
  end
end

RSpec.describe 'UpdateAndDeleteSimulation', type: :system do
  before do
    @user = User.create!(name: 'alice', email: 'alice@example.com', password: 'password',
                         confirmed_at: DateTime.now)
    @users_simulation = @user.simulations.create!(title: 'test-simulation')
  end

  it 'can update simulation', js: true do
    sign_in @user
    visit user_simulations_path(@user)
    click_on('編集')
    click_on('結果確認/保存へ')
    fill_in 'simulation[title]', with: '生産ラインB'
    click_on('データを保存')
    expect(page).to have_content 'シミュレーションが更新されました。'
  end

  it 'can delete simulation', js: true do
    sign_in @user
    visit user_simulations_path(@user)
    accept_confirm do
      click_on('削除')
    end
    expect(page).to have_content 'シミュレーションが削除されました。'
  end
end

RSpec.describe 'LimitSimulation', type: :system do
  before do
    @user = User.create!(name: 'alice', email: 'alice@example.com', password: 'password',
                         confirmed_at: DateTime.now)
    @user.simulations.create!(title: 'test-simulation1')
    @user.simulations.create!(title: 'test-simulation2')
    @user.simulations.create!(title: 'test-simulation3')
  end

  it 'cannot create simulation beyond the limit ', js: true do
    sign_in @user
    visit user_simulations_path(@user)
    expect(page).to have_content 'シミュレーション数が上限に達しています。'
  end
end
