import API_PATHS from "@/constants/apiPaths"
import httpService from "@/services/httpService"

import type { PaginatedResponse } from "@/types/pagination"

import type {
  CreateSessionReportPayload,
  CreateSessionReportResponse,
  DailyRankings,
  DailyRankingsParams,
  ListSessionReportsParams,
  ReportImageUploadResponse,
  SessionReport,
  StaffNamesResponse,
} from "../types/session-report"

export async function uploadReportImage(
  file: File
): Promise<ReportImageUploadResponse> {
  const formData = new FormData()
  formData.append("image", file)

  const { data } = await httpService.post<ReportImageUploadResponse>(
    API_PATHS.SESSION_REPORTS.UPLOAD_IMAGE,
    formData
  )
  return data
}

export async function fetchSessionReports(
  params: ListSessionReportsParams
): Promise<PaginatedResponse<SessionReport>> {
  const { data } = await httpService.get<PaginatedResponse<SessionReport>>(
    API_PATHS.SESSION_REPORTS.BASE,
    { params }
  )
  return data
}

export async function fetchDailyRankings(
  params: DailyRankingsParams
): Promise<DailyRankings> {
  const { data } = await httpService.get<DailyRankings>(
    API_PATHS.SESSION_REPORTS.DAILY_RANKINGS,
    { params }
  )
  return data
}

export async function createSessionReport(
  payload: CreateSessionReportPayload
): Promise<CreateSessionReportResponse> {
  const { data } = await httpService.post<CreateSessionReportResponse>(
    API_PATHS.SESSION_REPORTS.BASE,
    payload
  )
  return data
}

export async function fetchStaffNames(
  liveDate: string
): Promise<StaffNamesResponse> {
  const { data } = await httpService.get<StaffNamesResponse>(
    API_PATHS.SESSION_REPORTS.STAFF_NAMES,
    { params: { liveDate } }
  )
  return data
}
