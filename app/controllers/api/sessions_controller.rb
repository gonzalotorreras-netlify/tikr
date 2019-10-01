class Api::SessionsController < ApplicationController

    def create
        @user = User.find_by_credential(
            [:user][:username],
            [:user][:password]
        )

        if @user
            login(@user)
            render '/api/users/show'
        else
            render json: ['please fill out this field'], status: 422
        end
    end


    def destroy
        if current_user
            logout
            render json: {}
        else
            render json: ['not currently logged in']
        end
    end

end