json.array! @simulations do |simulation|
  json.extract! simulation, :id, :user_id, :title, :bottleneck_process, :waiting_time, :routes, :operators, :facilities, :created_at, :updated_at
end
