import { MovieEntity } from "../../domain/models/movie";
import { FullMovieDomainData } from "../../application/usecases/movie/getFullMovieData.usecase";
import { HomePageData } from "../../application/usecases/movie/getHomePage.usecase";
import { EnrichedMovie } from "../../application/types/enrichedMovie";
import { MovieDetailEntity } from "../../domain/models/movieDetail";
import { MovieMapper } from "../mappers/movie.mapper";
import { MoviePresenter } from "../presenters/movie.presenter";
import {
  Movie as MovieDto,
  UpcomingMovie,
} from "../../../../shared/types/api/dto";
import {
  FullMovieData,
  HomePageResponse,
} from "../../../../shared/types/api/response";

/**
 * MovieControllerから受け取ったドメイン層データを、API公開用の形状(DTO)へと構築する。
 * Mapper(構造変換)とPresenter(UI装飾)を取りまとめるオーケストレーター。
 */
export class MovieResponseBuilder {
  /**
   * 映画詳細画面用のレスポンスを構築する
   */
  buildDetails(domainData: FullMovieDomainData, today: Date): FullMovieData {
    // 1. 基本情報のDTO変換と装飾
    const decoratedDetail = MoviePresenter.toMovieDetail(
      MovieMapper.toDetailBffDto(domainData.detail, {
        videoKey: domainData.videoInfo.video,
      }),
      today,
    );

    // 2. おすすめ映画の変換 (ロゴパスの結合含む)
    const recommendations = {
      title: domainData.recommendation.title,
      movies: domainData.recommendation.movies.map((m) =>
        MovieMapper.toBffDto(m, { logoPath: domainData.recLogosMap.get(m.id) }),
      ),
    };

    // 3. 配信情報の装飾
    const watchProviders = MoviePresenter.enrichWatchProviderLinks(
      domainData.watchProviders,
      domainData.detail.baseInfo.title,
    );

    // 4. 最終形状の組み立て
    return {
      detail: decoratedDetail,
      image: domainData.imagePath,
      videoUrl: MoviePresenter.enrichVideoUrl(domainData.videoInfo.video),
      otherVideoUrls: domainData.videoInfo.otherVideos
        .map((key) => MoviePresenter.enrichVideoUrl(key))
        .filter((url): url is string => url !== null),
      recommendations,
      watchProviders,
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
          logoPath: m.logoPath,
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
          logoPath: m.logoPath,
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
  buildWatchList(
    items: { detailEntity: MovieDetailEntity; image: string | null }[],
  ): MovieDto[] {
    return items.map((item) =>
      MovieMapper.toBffDto(item.detailEntity.baseInfo, {
        logoPath: item.image,
      }),
    );
  }
}
