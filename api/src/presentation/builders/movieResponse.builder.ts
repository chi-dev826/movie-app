import { MovieEntity } from "../../domain/models/movie";
import { HomePageData } from "../../application/usecases/movie/getHomePage.usecase";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import { MovieMapper } from "../mappers/movie.mapper";
import { MoviePresenter } from "../presenters/movie.presenter";
import {
  Movie as MovieDto,
  MovieDetail,
  UpcomingMovie,
} from "../../../../shared/types/api/dto";
import {
  HomePageResponse,
  ResourcesResponse,
  RecommendationsResponse,
} from "../../../../shared/types/api/response";
import {
  RecommendationsDomainData,
  EnrichedMovie,
} from "../../application/types/movie.types";

/**
 * MovieControllerから受け取ったドメイン層データを、API公開用の形状(DTO)へと構築する。
 * Mapper(構造変換)とPresenter(UI装飾)を取りまとめるオーケストレーター。
 */
export class MovieResponseBuilder {
  /**
   * 映画詳細画面用のレスポンスを構築する
   */
  buildDetails(detailEntity: MovieDetailEntity, today: Date): MovieDetail {
    // 1. 基本情報のDTO変換と装飾
    const detailDto = MovieMapper.toDetailBffDto(detailEntity);
    return MoviePresenter.toMovieDetail(detailDto, today);
  }

  buildResources(resources: ResourcesResponse): ResourcesResponse {
    return {
      watchProviders: resources.watchProviders,
      videoInfo: {
        video: MoviePresenter.enrichVideoUrl(resources.videoInfo.video),
        otherVideos: (resources.videoInfo.otherVideos ?? [])
          .map((v) => MoviePresenter.enrichVideoUrl(v))
          .filter((url): url is string => url !== null),
      },
    };
  }

  /**
   * 映画詳細画面用のおすすめ映画のレスポンスを構築する
   */
  buildRecommendations(
    recommendations: RecommendationsDomainData,
  ): RecommendationsResponse {
    return {
      title: recommendations.recommendations.title,
      movies: recommendations.recommendations.movies.map((m) =>
        MovieMapper.toBffDto(m),
      ),
    };
  }

  /**
   * ホーム画面用のレスポンスを構築する
   */
  buildHomePage(data: HomePageData, today: Date): HomePageResponse {
    // 1. 各カテゴリのEntityをDTOに変換
    const recentlyAddedDto = data.recentlyAdded.movies.map((m) =>
      MovieMapper.toBffDto(m),
    );
    const upcomingDto = data.upcoming.movies.map((m) =>
      MoviePresenter.toUpcomingMovie(
        MovieMapper.toBffDto(m.entity, {
          videoKey: m.videoKey,
        }),
        today,
      ),
    );
    const nowPlayingDto = data.nowPlaying.movies.map((m) =>
      MovieMapper.toBffDto(m),
    );
    const trendingDto = data.trending.movies.map((m) =>
      MovieMapper.toBffDto(m),
    );

    // 2. ヒーローセクションを構築
    const hero = MoviePresenter.toHomeHeroList(
      upcomingDto,
      nowPlayingDto,
      recentlyAddedDto,
    );

    return {
      hero,
      upcoming: {
        movies: upcomingDto,
        currentPage: data.upcoming.currentPage,
        totalPages: data.upcoming.totalPages,
      },
      nowPlaying: {
        movies: nowPlayingDto,
        currentPage: data.nowPlaying.currentPage,
        totalPages: data.nowPlaying.totalPages,
      },
      recentlyAdded: {
        movies: recentlyAddedDto,
        currentPage: data.recentlyAdded.currentPage,
        totalPages: data.recentlyAdded.totalPages,
      },
      trending: {
        movies: trendingDto,
        currentPage: data.trending.currentPage,
        totalPages: data.trending.totalPages,
      },
    };
  }

  /**
   * 近日公開映画のリストを構築する
   */
  buildUpcomingList(movies: EnrichedMovie[], today: Date): UpcomingMovie[] {
    return movies.map((m) =>
      MoviePresenter.toUpcomingMovie(
        MovieMapper.toBffDto(m.entity, {
          videoKey: m.videoKey,
        }),
        today,
      ),
    );
  }

  /**
   * 汎用的な映画リスト(検索結果等)を構築する
   */
  buildSimpleList(movies: readonly MovieEntity[]): MovieDto[] {
    return movies.map((m) => MovieMapper.toBffDto(m));
  }

  /**
   * ウォッチリスト(複数映画データ)のレスポンスを構築する
   */
  buildWatchList(items: { detailEntity: MovieDetailEntity }[]): MovieDto[] {
    return items.map((item) =>
      MovieMapper.toBffDto(item.detailEntity.baseInfo),
    );
  }
}
