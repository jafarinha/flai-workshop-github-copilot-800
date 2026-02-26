from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    team = serializers.SerializerMethodField()
    team_id = serializers.CharField(write_only=True, required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = User
        fields = ['_id', 'name', 'username', 'email', 'password', 'team', 'team_id']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    def get_team(self, obj):
        try:
            team = obj.team_set.first()
            if team:
                return {'_id': str(team.pk), 'name': team.name}
        except Exception:
            pass
        return None

    def update(self, instance, validated_data):
        _SENTINEL = object()
        team_id = validated_data.pop('team_id', _SENTINEL)
        instance = super().update(instance, validated_data)
        # Update team membership only if team_id was explicitly provided
        if team_id is not _SENTINEL:
            # Remove user from all current teams
            for team in instance.team_set.all():
                team.members.remove(instance)
            # Add to new team if id provided and non-empty
            if team_id:
                try:
                    new_team = Team.objects.get(pk=team_id)
                    new_team.members.add(instance)
                except Team.DoesNotExist:
                    pass
        return instance


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user', 'activity_type', 'duration', 'date']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    def get_user(self, obj):
        try:
            return obj.user.username
        except Exception:
            return str(obj.user_id)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'user', 'score']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None

    def get_user(self, obj):
        try:
            return obj.user.username
        except Exception:
            return str(obj.user_id)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'duration']

    def get__id(self, obj):
        return str(obj._id) if obj._id else None
